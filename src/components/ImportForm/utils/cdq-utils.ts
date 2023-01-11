import * as React from 'react';
import {
  useK8sWatchResource,
  k8sDeleteResource,
  k8sGetResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import {
  ComponentDetectionQueryModel,
  ComponentDetectionQueryGroupVersionKind,
} from '../../../models';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { ComponentDetectionQueryKind, DetectedComponents } from '../../../types';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { useNamespace } from '../../../utils/namespace-context-utils';

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
  const namespace = useNamespace();

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
      if (source === cdq.spec.git.url) {
        return cdq?.status?.componentDetected;
      }
    }
    return undefined;
  }, [source, cdqName, loaded, cdq]);

  const detectionCompleted = React.useMemo(() => {
    if (cdqName && loaded && cdq) {
      return cdq?.status?.conditions?.some(
        (condition) => condition.type === 'Completed' && condition.reason === 'OK',
      );
    }
    return false;
  }, [cdqName, loaded, cdq]);

  const error = React.useMemo(() => {
    if (createError) {
      return createError;
    }
    if (cdqName) {
      if (loadError) {
        return loadError;
      }

      const errorCondition = cdq?.status?.conditions?.find(
        (condition) => condition.type === 'Completed' && condition.reason === 'Error',
      );

      if (loaded && !detectedComponents && errorCondition) {
        if (cdqName === cdq.metadata.name) {
          return errorCondition.message;
        }
      }
    }
  }, [cdq, cdqName, createError, detectedComponents, loadError, loaded]);

  return [detectedComponents, detectionCompleted, error];
};

export const mapDetectedComponents = (detectedComponents: DetectedComponents) => {
  return Object.values(detectedComponents).map((component) => component.componentStub);
};

const CDQ_POLL_INTERVAL = 500;

/**
 * Create a ComponentDetectionQuery and poll it until detection is completed.
 * return the detected components after completion and delete the resource.
 */
export const detectComponents = async (
  source: string,
  application: string,
  namespace: string,
  secret?: string,
  context?: string,
  ref?: string,
) => {
  let cdq = await createComponentDetectionQuery(
    application,
    source,
    namespace,
    secret,
    context,
    ref,
  );
  try {
    while (!cdq.status?.conditions?.find((c) => c.type === 'Completed' && c.status === 'True')) {
      await new Promise((r) => setTimeout(r, CDQ_POLL_INTERVAL));
      cdq = await k8sGetResource({
        model: ComponentDetectionQueryModel,
        queryOptions: {
          name: cdq.metadata.name,
          ns: namespace,
        },
      });
    }
    const completeCondition = cdq.status.conditions.find((c) => c.type === 'Completed');
    if (!cdq.status.componentDetected || completeCondition.reason === 'Error') {
      throw new Error(completeCondition.message);
    }
  } finally {
    await k8sDeleteResource({
      model: ComponentDetectionQueryModel,
      queryOptions: { name: cdq.metadata.name, ns: namespace },
    });
  }

  return cdq.status.componentDetected;
};
