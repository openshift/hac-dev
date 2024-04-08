import * as React from 'react';
import { createEnvironmentKindFromReleasePlan } from '../components/Environment/environment-utils';
import { EnvironmentKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useEnvironments } from './useEnvironments';
import { useReleasePlans } from './useReleasePlans';

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const useAllEnvironments = (): [EnvironmentKind[], boolean] => {
  const { namespace } = useWorkspaceInfo();
  const [environments, environmentsLoaded] = useEnvironments();
  const [releasePlans, releasePlansLoaded] = useReleasePlans(namespace);

  const allLoaded = environmentsLoaded && releasePlansLoaded;

  const allEnvironments: EnvironmentKind[] = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }

    const managedEnvironments: EnvironmentKind[] = releasePlans.map((releasePlan) => {
      return {
        ...createEnvironmentKindFromReleasePlan(releasePlan),
      };
    });
    return [...managedEnvironments, ...environments];
  }, [allLoaded, environments, releasePlans]);

  return [allEnvironments, allLoaded];
};
