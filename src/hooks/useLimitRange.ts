import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { LimitRangeGroupVersionKind } from '../models';
import { LimitRange } from '../types/coreBuildService';

export enum CPUUnits {
  millicores = 'millicores',
  cores = 'cores',
}

export enum MemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi',
}

export type FormResources = {
  cpu: string;
  cpuUnit: CPUUnits;
  memory: string;
  memoryUnit: MemoryUnits;
};

const getResourceData = (res?: string) => {
  const resourcesRegEx = /^[0-9]*|[a-zA-Z]*/g;
  return res ? res.match(resourcesRegEx) : [];
};

const CPUResourceMap = {
  m: CPUUnits.millicores,
  '': CPUUnits.cores,
};

type ResourceData = {
  limits?: { cpu?: string; memory?: string };
  requests?: { cpu?: string; memory?: string };
};

export const createResourceData = (resources: ResourceData): FormResources => {
  const memory = resources?.requests?.memory || resources?.limits?.memory;
  const cpu = resources?.requests?.cpu || resources?.limits?.cpu;
  const [memoryResource, memoryUnit] = getResourceData(memory);
  const [cpuResource, cpuUnit] = getResourceData(cpu);

  return {
    cpu: cpuResource || '10',
    cpuUnit: CPUResourceMap[cpuUnit] || CPUUnits.millicores,
    memory: memoryResource || '50',
    memoryUnit: MemoryUnits[memoryUnit] || MemoryUnits.Mi,
  };
};

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
