import * as React from 'react';
import { EnvironmentKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import { createEnvironmentKindFromReleasePlan } from '../components/Environment/utils';
import { useEnvironments } from './useEnvironments';
import { useReleasePlans } from './useReleasePlans';

export const useAllEnvironments = (): [EnvironmentKind[], boolean] => {
  const namespace = useNamespace();
  const [environments, environmentsLoaded] = useEnvironments(namespace);
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
