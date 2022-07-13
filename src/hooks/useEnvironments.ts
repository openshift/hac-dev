import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useNamespace } from '../components/NamespacedPage/NamespacedPage';
import { EnvironmentGroupVersionKind } from '../models/environment';
import { EnvironmentKind } from '../types';

export const useEnvironments = () => {
  const { namespace } = useNamespace();
  return useK8sWatchResource<EnvironmentKind[]>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    isList: true,
  });
};
