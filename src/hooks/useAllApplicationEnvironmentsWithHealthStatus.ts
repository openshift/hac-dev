import * as React from 'react';
import { EnvironmentType } from '../components/Environment/environment-utils';
import { EnvironmentKind } from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { getComponentDeploymentStatus } from '../utils/environment-utils';
import { conditionsRunStatus, pipelineRunStatusToGitOpsStatus } from '../utils/pipeline-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useAllEnvironments } from './useAllEnvironments';
import { useReleases } from './useReleases';
import { useSnapshotsEnvironmentBindings } from './useSnapshotsEnvironmentBindings';

export type EnvironmentKindWithHealthStatus = EnvironmentKind & {
  healthStatus: GitOpsDeploymentHealthStatus;
  lastDeploy: string;
  snapshot?: string;
};

export const useAllApplicationEnvironmentsWithHealthStatus = (
  applicationName: string,
): [EnvironmentKindWithHealthStatus[], boolean] => {
  const { namespace } = useWorkspaceInfo();
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
      const latestRelease = releases
        .filter((release) => release.spec.releasePlan === environment.metadata.name)
        .sort((a, b) => (a.status.startTime > b.status.startTime ? -1 : 1))[0];

      if (latestRelease && environment.spec.tags?.includes(EnvironmentType.managed)) {
        return {
          ...environment,
          healthStatus: latestRelease
            ? pipelineRunStatusToGitOpsStatus(conditionsRunStatus(latestRelease.status?.conditions))
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
          snapshotsEnvironmentBinding?.status?.componentDeploymentConditions?.[0]
            ?.lastTransitionTime,
        snapshot: snapshotsEnvironmentBinding?.spec?.snapshot,
      };
    });
  }, [allLoaded, snapshotsEnvironmentBindings, environments, releases]);

  return [envsWithStatus, allLoaded];
};
