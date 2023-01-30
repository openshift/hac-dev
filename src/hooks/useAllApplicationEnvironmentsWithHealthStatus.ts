import * as React from 'react';
import { EnvironmentType } from '../components/Environment/environment-utils';
import { pipelineRunStatus, pipelineRunStatusToGitOpsStatus } from '../shared';
import { EnvironmentKind } from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { getComponentDeploymentStatus } from '../utils/environment-utils';
import { useNamespace } from '../utils/namespace-context-utils';
import { useAllEnvironments } from './useAllEnvironments';
import { useReleases } from './useReleases';
import { useSnapshotsEnvironmentBindings } from './useSnapshotsEnvironmentBindings';

export type EnvironmentKindWithHealthStatus = EnvironmentKind & {
  healthStatus: GitOpsDeploymentHealthStatus;
  lastDeploy: string;
};

export const useAllApplicationEnvironmentsWithHealthStatus = (
  applicationName: string,
): [EnvironmentKindWithHealthStatus[], boolean] => {
  const namespace = useNamespace();
  const [environments, environmentsLoaded] = useAllEnvironments();
  const [releases, releasesLoaded] = useReleases(namespace);
  const [snapshotsEnvironmentBindings, snapshotsLoaded] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );

  const allLoaded = environmentsLoaded && releasesLoaded && snapshotsLoaded;

  const envsWithStatus: EnvironmentKindWithHealthStatus[] = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }

    return environments.map((environment) => {
      if (environment.spec.tags?.includes(EnvironmentType.managed)) {
        const latestRelease = releases
          .filter((release) => release.spec.releasePlan === environment.metadata.name)
          .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))[0];
        return {
          ...environment,
          healthStatus: latestRelease
            ? pipelineRunStatusToGitOpsStatus(pipelineRunStatus(latestRelease))
            : GitOpsDeploymentHealthStatus.Missing,
          lastDeploy: latestRelease?.status.completionTime,
        };
      }
      const snapshotsEnvironmentBinding = snapshotsEnvironmentBindings.find(
        (as) => as.spec.environment === environment.metadata.name,
      );

      return {
        ...environment,
        healthStatus: getComponentDeploymentStatus(snapshotsEnvironmentBinding),
        lastDeploy:
          snapshotsEnvironmentBinding?.status?.componentDeploymentConditions[0]?.lastTransitionTime,
      };
    });
  }, [allLoaded, snapshotsEnvironmentBindings, environments, releases]);

  return [envsWithStatus, allLoaded];
};
