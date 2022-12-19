import * as React from 'react';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { pipelineRunStatus, pipelineRunStatusToGitOpsStatus } from '../shared';
import { EnvironmentKind } from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';
import { useNamespace } from '../utils/namespace-context-utils';
import { useSortedEnvironments } from './useEnvironments';
import { useSnapshotsEnvironmentBindings } from './useSnapshotsEnvironmentBindings';
import { useTestPipelines } from './useTestPipelines';

export type EnvironmentKindWithHealthStatus = EnvironmentKind & {
  healthStatus: GitOpsDeploymentHealthStatus;
};

export const useApplicationEnvironmentsWithHealthStatus = (
  applicationName: string,
): [EnvironmentKindWithHealthStatus[], boolean] => {
  const namespace = useNamespace();
  const [environments, environmentsLoaded] = useSortedEnvironments();
  const [snapshotsEnvironmentBindings, snapshotsLoaded] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(namespace, applicationName);

  const allLoaded = environmentsLoaded && snapshotsLoaded && testPipelinesLoaded;

  const envsWithStatus: EnvironmentKindWithHealthStatus[] = React.useMemo(() => {
    if (!allLoaded) {
      return [];
    }

    return environments.map((environment) => {
      const snapshotsEnvironmentBinding = snapshotsEnvironmentBindings
        .filter((as) => as.spec.environment === environment.metadata.name)
        .sort?.(
          (a, b) =>
            new Date(b.metadata.creationTimestamp).getTime() -
            new Date(a.metadata.creationTimestamp).getTime(),
        )
        .shift();
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
  }, [allLoaded, snapshotsEnvironmentBindings, environments, testPipelines]);

  return [envsWithStatus, allLoaded];
};
