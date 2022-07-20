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
import { useNamespace } from '../../NamespacedPage/NamespacedPage';

const SPI_API_URL =
  'https://spi-oauth-route-spi-system.apps.appstudio-stage.x99m.p1.openshiftapps.com';

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
  const { namespace } = useNamespace();
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
            repoUrl: source,
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

  return React.useMemo(
    () => [
      {
        isRepoAccessible: accessCheck?.status?.accessible,
        isGit: accessCheck?.status?.repoType === 'git',
        accessibility: accessCheck?.status?.accessibility,
        serviceProvider: accessCheck?.status?.serviceProvider,
      },
      !!(name && loaded),
    ],
    [accessCheck, loaded, name],
  );
};

/**
 * Create the SPIAccessTokenBinding resource when source changes
 * and set the specified secret upon successful injection.
 *
 * @returns oAuth URL provided by the binding
 */
export const useAccessTokenBinding = (
  source: string,
): [{ oAuthUrl: string; accessTokenName: string }, boolean] => {
  const { namespace } = useNamespace();
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
    if (binding.status?.phase === SPIAccessTokenBindingPhase.Injected) {
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
    setFieldValue,
    binding?.status?.phase,
    binding?.status?.errorMessage,
    binding?.status?.syncedObjectRef?.name,
  ]);

  return [
    {
      oAuthUrl: binding?.status?.oAuthUrl,
      accessTokenName: binding?.status?.linkedAccessTokenName,
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
  const { namespace } = useNamespace();
  const {
    auth: { getToken },
  } = useChrome();

  return React.useMemo(
    () => ({
      uploadToken: async (accessTokenName: string, username: string, accessToken: string) => {
        const token = await getToken();
        return fetch(`${SPI_API_URL}/token/${namespace}/${accessTokenName}`, {
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
    [getToken, namespace],
  );
};
