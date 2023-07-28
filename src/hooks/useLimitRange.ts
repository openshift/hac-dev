import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { createResourceData } from '../components/ImportForm/utils/transform-utils';
import { FormResources } from '../components/ImportForm/utils/types';
import { LimitRangeGroupVersionKind } from '../models';
import { LimitRange } from '../types/coreBuildService';

export const useLimitRanges = (namespace: string): [LimitRange[], boolean, unknown] =>
  useK8sWatchResource<LimitRange[]>({
    groupVersionKind: LimitRangeGroupVersionKind,
    namespace,
    isList: true,
  });

export const useLimitRange = (
  namespace: string,
  limitRangeName?: string,
): [LimitRange, boolean, unknown] => {
  const [limitRange, limitRangeLoaded, error] = useK8sWatchResource<LimitRange>(
    limitRangeName
      ? {
          groupVersionKind: LimitRangeGroupVersionKind,
          namespace,
          name: limitRangeName,
        }
      : undefined,
  );
  return React.useMemo((): [LimitRange, boolean, unknown] => {
    if (limitRangeLoaded && !error && limitRange?.metadata?.deletionTimestamp) {
      return [null, limitRangeLoaded, { code: 404 }];
    }
    return [limitRange, limitRangeLoaded, error];
  }, [limitRange, limitRangeLoaded, error]);
};

export const useResourceLimits = (namespace: string, max?: boolean): FormResources => {
  const [limitRange, limitRangeLoaded, error] = useLimitRange(namespace, 'resource-limits');

  if (!limitRangeLoaded || error) {
    return createResourceData({
      requests: {
        cpu: '10m',
        memory: '256Mi',
      },
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
    });
  }

  const limit = limitRange?.spec?.limits?.find((l) => l.type === 'Container');
  return createResourceData({
    ...(!max ? { requests: limit?.defaultRequest } : {}),
    limits: limit?.default,
  });
};
