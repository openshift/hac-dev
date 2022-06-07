import * as React from 'react';
import {
  useK8sWatchResource,
  k8sDeleteResource,
  k8sCreateResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { useFormikContext } from 'formik';
import {
  ComponentDetectionQueryGroupVersionKind,
  SPIAccessCheckGroupVersionKind,
  SPIAccessCheckModel,
  SPIAccessTokenBindingGroupVersionKind,
} from '../../models';
import { useDebounceCallback } from '../../shared/hooks/useDebounceCallback';
import {
  ComponentDetectionQueryKind,
  DetectedComponents,
  ServiceProviderType,
  SPIAccessCheckAccessibilityStatus,
  SPIAccessCheckKind,
  SPIAccessTokenBindingKind,
  SPIAccessTokenBindingPhase,
} from '../../types';
import {
  createComponentDetectionQuery,
  initiateAccessTokenBinding,
} from '../../utils/create-utils';
import { ComponentDetectionQueryModel } from './../../models/component';
import { NamespaceContext } from './../NamespacedPage/NamespacedPage';
import { AddComponentValues } from './AddComponentForm';

/**
 * Create the SPIAccessTokenBinding resource when source changes
 * and set the specified secret upon successful injection.
 *
 * @returns oAuth URL provided by the binding
 */
export const useAccessTokenBindingAuth = (source: string): [string, boolean] => {
  const { namespace } = React.useContext(NamespaceContext);
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
      setFieldValue('git.authSecret', binding.status.syncedObjectRef.name);
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

  return [binding?.status?.oAuthUrl, name && loaded];
};

/**
 * Create a ComponentDetectionQuery when any of the params change,
 * and return the detected components when detection is completed.
 */
export const useComponentDetection = (
  source: string,
  application: string,
  gitOptions?: AddComponentValues['git'],
): [DetectedComponents, any] => {
  const { namespace } = React.useContext(NamespaceContext);
  const [cdqName, setCdqName] = React.useState<string>();
  const [createError, setCreateError] = React.useState();

  const [cdq, loaded, loadError] = useK8sWatchResource<ComponentDetectionQueryKind>(
    cdqName
      ? {
          groupVersionKind: ComponentDetectionQueryGroupVersionKind,
          name: cdqName,
          namespace,
          isList: false,
        }
      : null,
  );

  const debouncedCreateCDQ = useDebounceCallback(
    React.useCallback<(...args: Parameters<typeof createComponentDetectionQuery>) => void>(
      (...args) =>
        createComponentDetectionQuery(...args)
          .then((resource) => setCdqName(resource.metadata.name))
          .catch(setCreateError),
      [],
    ),
  );

  React.useEffect(() => {
    setCdqName(null);
    setCreateError(null);
    if (source) {
      debouncedCreateCDQ(
        application,
        source,
        namespace,
        gitOptions?.isMultiComponent,
        gitOptions?.authSecret,
        gitOptions?.contextDir,
        gitOptions?.reference,
      );
    }
  }, [debouncedCreateCDQ, application, source, namespace, gitOptions]);

  React.useEffect(() => {
    return () => {
      if (cdqName) {
        k8sDeleteResource({
          model: ComponentDetectionQueryModel,
          queryOptions: { name: cdqName, ns: namespace },
        });
      }
    };
  }, [cdqName, namespace]);

  const detectedComponents = React.useMemo(() => {
    if (cdqName && loaded && cdq) {
      if (cdqName === cdq.metadata.name) {
        return cdq?.status?.componentDetected;
      }
    }
    return undefined;
  }, [cdqName, cdq, loaded]);

  const error = React.useMemo(() => {
    if (createError) {
      return createError;
    }
    if (cdqName) {
      if (loadError) {
        return loadError;
      }

      const completeCondition = cdq?.status?.conditions?.find(
        (condition) => condition.type === 'Completed',
      );

      if (loaded && !detectedComponents && completeCondition) {
        if (cdqName === cdq.metadata.name) {
          return completeCondition.message;
        }
      }
    }
  }, [cdq, cdqName, createError, detectedComponents, loadError, loaded]);

  return [detectedComponents, error];
};

export const mapDetectedComponents = (
  detectedComponents: DetectedComponents,
  isSample: boolean = false,
) => {
  return Object.values(detectedComponents).map(({ componentStub: component }) => ({
    name: isSample ? `${component.componentName}-sample` : component.componentName,
    uid: component.componentName,
    type: 'source',
    data: {
      source: component.source,
      contextDir: component.context,
      targetPort: component.targetPort,
      resources: component.resources,
      replicas: component.replicas,
      route: component.route,
      env: component.env,
    },
  }));
};
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
  const { namespace } = React.useContext(NamespaceContext);
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
      name && loaded,
    ],
    [accessCheck, loaded, name],
  );
};
