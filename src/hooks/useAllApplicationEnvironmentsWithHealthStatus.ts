import * as React from 'react';
import { getLatestResource } from '../components/ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { EnvironmentType } from '../hacbs/components/Environment/utils';
import { pipelineRunStatus, pipelineRunStatusToGitOpsStatus } from '../shared';
import { EnvironmentKind } from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { useNamespace } from '../utils/namespace-context-utils';
import { useAllEnvironments } from './useAllEnvironments';
import { useReleases } from './useReleases';
import { useSnapshotsEnvironmentBindings } from './useSnapshotsEnvironmentBindings';
import { useTestPipelines } from './useTestPipelines';

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
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(namespace, applicationName);

  const allLoaded = environmentsLoaded && releasesLoaded && snapshotsLoaded && testPipelinesLoaded;

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
      const snapshotsEnvironmentBinding = getLatestResource(
        snapshotsEnvironmentBindings.filter(
          (as) => as.spec.environment === environment.metadata.name,
        ),
      );
      const testPipeline = snapshotsEnvironmentBinding
        ? testPipelines.find(
            (pipeline) =>
              pipeline?.metadata?.labels[PipelineRunLabel.SNAPSHOT] ===
              snapshotsEnvironmentBinding.spec.snapshot,
          )
        : undefined;

      return {
        ...environment,
        healthStatus: testPipeline
          ? pipelineRunStatusToGitOpsStatus(pipelineRunStatus(testPipeline))
          : GitOpsDeploymentHealthStatus.Missing,
        lastDeploy: testPipeline?.status.completionTime,
      };
    });
  }, [allLoaded, snapshotsEnvironmentBindings, environments, releases, testPipelines]);

  return [envsWithStatus, allLoaded];
};
