import * as React from 'react';
import {
  k8sCreateResource,
  k8sDeleteResource,
  K8sResourceCommon,
  useK8sWatchResource,
} from '@openshift/dynamic-plugin-sdk-utils';
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
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

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
  const { namespace } = useWorkspaceInfo();
  const [name, setName] = React.useState<string>();
  const sourceRef = React.useRef(source);

  React.useEffect(() => {
    let resourceName = null;

    if (!source) {
      setName(null);
      return;
    }

    if (sourceRef.current !== source) {
      sourceRef.current = source;
    }

    if (source) {
      k8sCreateResource<K8sResourceCommon>({
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
        resourceName = res.metadata.name;
        setName(resourceName);
      });
    }
    return () => {
      if (resourceName) {
        k8sDeleteResource({
          model: SPIAccessCheckModel,
          queryOptions: {
            name: resourceName,
            ns: namespace,
          },
        });
      }
    };
  }, [namespace, source, dependency]);

  const [accessCheck, loaded] = useK8sWatchResource<SPIAccessCheckKind>(
    name && sourceRef.current === source
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
  const { namespace } = useWorkspaceInfo();
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

/**
 * Initiate SPI Auth session
 * POST request returns setCookie header in response which is set on oAuthURl domain.
 */
export const initiateSpiAuthSession = async (oAuthUrl: string, token: string) => {
  await fetch(`${oAuthUrl.split('/oauth/')[0]}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
