import { useMemo } from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { EnvironmentGroupVersionKind } from '../models/environment';
import { EnvironmentKind } from '../types';
import { sortEnvironmentsBasedonParent } from '../utils/environment-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const useEnvironments = () => {
  const { namespace } = useWorkspaceInfo();
  return useK8sWatchResource<EnvironmentKind[]>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    isList: true,
  });
};

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const useSortedEnvironments = (): [EnvironmentKind[], boolean, unknown] => {
  const [envs, loaded, error] = useEnvironments();

  const environments = useMemo(() => {
    return loaded && !error ? sortEnvironmentsBasedonParent(envs) : [];
  }, [envs, error, loaded]);

  return [environments, loaded, error];
};
