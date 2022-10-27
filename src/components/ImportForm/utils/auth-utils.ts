import * as React from 'react';
import { k8sCreateResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useFormikContext } from 'formik';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import {
  SPIAccessCheckModel,
  SPIAccessCheckGroupVersionKind,
  SPIAccessTokenBindingGroupVersionKind,
} from '../../../models';
import {
  SPIAccessCheckAccessibilityStatus,
  ServiceProviderType,
  SPIAccessCheckKind,
  SPIAccessTokenBindingKind,
  SPIAccessTokenBindingPhase,
} from '../../../types';
import { initiateAccessTokenBinding } from '../../../utils/create-utils';
import { useNamespace } from '../../../utils/namespace-context-utils';

/**
 * Create a new SPIAccessCheck when source changes,
 * and return true if the source is accessible.
 */
export const useAccessCheck = (
  source: string,
  dependency,
): [
  {
    isRepoAccessible: boolean;
    isGit: boolean;
    accessibility: SPIAccessCheckAccessibilityStatus;
    serviceProvider: ServiceProviderType;
  },
  boolean,
] => {
  const namespace = useNamespace();
  const [name, setName] = React.useState<string>();

  React.useEffect(() => {
    if (source) {
      k8sCreateResource({
        model: SPIAccessCheckModel,
        queryOptions: {
          ns: namespace,
        },
        resource: {
          apiVersion: `${SPIAccessCheckModel.apiGroup}/${SPIAccessCheckModel.apiVersion}`,
          kind: SPIAccessCheckModel.kind,
          metadata: {
            generateName: 'hacdev-check-',
            namespace,
          },
          spec: {
            repoUrl: source.trim(),
          },
        },
      }).then((res) => {
        // TODO fix type for generateName resources not having name?
        setName((res.metadata as any).name);
      });
    }
  }, [namespace, source, dependency]);

  const [accessCheck, loaded] = useK8sWatchResource<SPIAccessCheckKind>(
    name
      ? {
          groupVersionKind: SPIAccessCheckGroupVersionKind,
          name,
          namespace,
        }
      : null,
  );

  // wait for the access check to have a status
  const accessCheckProcessed = loaded && !!accessCheck?.status;

  return React.useMemo(
    () => [
      {
        isRepoAccessible: accessCheck?.status?.accessible,
        isGit: accessCheck?.status?.repoType === 'git',
        accessibility: accessCheck?.status?.accessibility,
        serviceProvider: accessCheck?.status?.serviceProvider,
      },
      !!(name && accessCheckProcessed),
    ],
    [accessCheck, accessCheckProcessed, name],
  );
};

/**
 * Create the SPIAccessTokenBinding resource when source changes
 * and set the specified secret upon successful injection.
 *
 * @returns oAuth URL provided by the binding
 */
export const useAccessTokenBinding = (
  source?: string,
): [{ oAuthUrl: string; uploadUrl: string }, boolean] => {
  const namespace = useNamespace();
  const { setFieldValue } = useFormikContext();
  const [name, setName] = React.useState<string>();

  React.useEffect(() => {
    if (source) {
      initiateAccessTokenBinding(source, namespace)
        .then((resource) => {
          setName(resource.metadata.name);
        })
        // eslint-disable-next-line no-console
        .catch((e) => console.error('Error when initiating access token binding: ', e));
    } else {
      setName(null);
    }
  }, [namespace, source]);

  const [binding, loaded] = useK8sWatchResource<SPIAccessTokenBindingKind>(
    name
      ? {
          groupVersionKind: SPIAccessTokenBindingGroupVersionKind,
          name,
          namespace,
        }
      : null,
  );

  React.useEffect(() => {
    if (!name || !loaded) return;
    // set injected token only if source hasn't changed after call
    if (
      binding.status?.phase === SPIAccessTokenBindingPhase.Injected &&
      binding.spec?.repoUrl === source
    ) {
      setFieldValue('secret', binding.status.syncedObjectRef.name);
      // eslint-disable-next-line no-console
      console.log('Git repository successfully authorized.');
    } else if (binding.status?.phase === SPIAccessTokenBindingPhase.Error) {
      // eslint-disable-next-line no-console
      console.log('Error in binding status ', binding.status.errorMessage);
    }
  }, [
    name,
    loaded,
    source,
    setFieldValue,
    binding?.status?.phase,
    binding?.status?.errorMessage,
    binding?.status?.syncedObjectRef.name,
    binding?.spec?.repoUrl,
  ]);

  return [
    {
      oAuthUrl: binding?.status?.oAuthUrl,
      uploadUrl: binding?.status?.uploadUrl,
    },
    !!(name && loaded),
  ];
};

/**
 * Utils for interaction with the SPI API.
 *
 * Utils:
 * - uploadToken: Upload access token to the `POST /token/{ns}/{name}` endpoint
 *
 * @returns object of utils
 */
export const useSpiAPI = () => {
  const {
    auth: { getToken },
  } = useChrome();

  return React.useMemo(
    () => ({
      uploadToken: async (uploadUrl: string, username: string, accessToken: string) => {
        const token = await getToken();
        return fetch(uploadUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            // eslint-disable-next-line camelcase
            access_token: accessToken,
          }),
        });
      },
    }),
    [getToken],
  );
};
