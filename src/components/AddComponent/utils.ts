import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useFormikContext } from 'formik';
import {
  ComponentDetectionQueryGroupVersionKind,
  SPIAccessTokenBindingGroupVersionKind,
} from '../../models';
import {
  ComponentDetectionQueryKind,
  DetectedComponents,
  SPIAccessTokenBindingKind,
  SPIAccessTokenBindingPhase,
} from '../../types';
import { createComponentDetectionQuery } from '../../utils/create-utils';
import { NamespaceContext } from './../NamespacedPage/NamespacedPage';

/**
 * Watch the SPIAccessTokenBinding resource and open auth window when provided.
 * Upon successful injection, set the specified secret.
 */
export const useAccessTokenBindingAuth = (name: string) => {
  const { namespace } = React.useContext(NamespaceContext);
  const { setFieldValue } = useFormikContext();
  const [binding, loaded] = useK8sWatchResource<SPIAccessTokenBindingKind>({
    groupVersionKind: SPIAccessTokenBindingGroupVersionKind,
    name,
    namespace,
  });

  React.useEffect(() => {
    if (!name || !loaded) return;
    const oAuthUrl = binding.status?.oAuthUrl;
    if (oAuthUrl) {
      window.open(oAuthUrl);
    }
  }, [binding?.status?.oAuthUrl, loaded, name]);

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
};

/**
 * Create a ComponentDetectionQuery when any of the params change,
 * and return the detected components when detection is completed.
 */
export const useComponentDetection = (
  source: string,
  application: string,
  isMultiComponent?: boolean,
  authSecret?: string,
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

  React.useEffect(() => {
    setCdqName(null);
    setCreateError(null);
    if (source) {
      createComponentDetectionQuery(application, source, namespace, isMultiComponent, authSecret)
        .then((resource) => setCdqName(resource.metadata.name))
        .catch(setCreateError);
    }
  }, [application, authSecret, isMultiComponent, namespace, source]);

  const detectedComponents = React.useMemo(() => {
    if (cdqName && loaded && cdq) {
      if (cdqName === cdq.metadata.name) {
        return cdq?.status?.componentDetected;
      }
    }
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
