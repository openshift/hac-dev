import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { EnvironmentGroupVersionKind } from '../models';
import { EnvironmentKind } from '../types/coreBuildService';

export const useEnvironments = (namespace: string): [EnvironmentKind[], boolean, unknown] =>
  useK8sWatchResource<EnvironmentKind[]>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    isList: true,
  });
