import * as React from 'react';
import { useK8sWatchResource, k8sDeleteResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  ComponentDetectionQueryModel,
  ComponentDetectionQueryGroupVersionKind,
} from '../../../models';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { ComponentDetectionQueryKind, DetectedComponents } from '../../../types';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { useNamespace } from '../../NamespacedPage/NamespacedPage';

/**
 * Create a ComponentDetectionQuery when any of the params change,
 * and return the detected components when detection is completed.
 */
export const useComponentDetection = (
  source: string,
  application: string,
  secret?: string,
  context?: string,
  ref?: string,
): [DetectedComponents, boolean, any] => {
  const { namespace } = useNamespace();

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
      debouncedCreateCDQ(application, source, namespace, secret, context, ref);
    }
  }, [debouncedCreateCDQ, source, namespace, secret, application, context, ref]);

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

  return [detectedComponents, cdq && loaded, error];
};

export const mapDetectedComponents = (detectedComponents: DetectedComponents) => {
  return Object.values(detectedComponents).map((component) => component.componentStub);
};
