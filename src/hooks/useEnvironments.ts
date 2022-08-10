import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { EnvironmentGroupVersionKind } from '../models/environment';
import { EnvironmentKind } from '../types';
import { useNamespace } from '../utils/namespace-context-utils';

export const useEnvironments = () => {
  const namespace = useNamespace();
  return useK8sWatchResource<EnvironmentKind[]>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    isList: true,
  });
};
