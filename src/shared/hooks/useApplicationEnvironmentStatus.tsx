import * as React from 'react';
import { getLatestResource } from '../../components/ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useSnapshotsEnvironmentBindings } from '../../hooks/useSnapshotsEnvironmentBindings';
import { useTestPipelines } from '../../hooks/useTestPipelines';
import { GitOpsDeploymentHealthStatus } from '../../types/gitops-deployment';
import { getGitOpsDeploymentHealthStatusIcon } from '../../utils/gitops-utils';
import { pipelineRunStatus, pipelineRunStatusToGitOpsStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

export const useApplicationEnvironmentStatus = (
  applicationName: string,
  environmentName: string,
): [string, React.ReactNode, string, boolean] => {
  const { namespace } = useWorkspaceInfo();
  const [snapshotsEnvironmentBindings, snapshotsLoaded] = useSnapshotsEnvironmentBindings(
    namespace,
    applicationName,
  );
  const [testPipelines, testPipelinesLoaded] = useTestPipelines(namespace, applicationName);
  const allLoaded = snapshotsLoaded && testPipelinesLoaded;

  return React.useMemo(() => {
    if (!applicationName || !environmentName || !allLoaded) {
      return [null, null, null, false];
    }
    const snapshotsEnvironmentBinding = getLatestResource(
      snapshotsEnvironmentBindings.filter((as) => as.spec.environment === environmentName),
    );
    const testPipeline = snapshotsEnvironmentBinding
      ? testPipelines.find(
          (pipeline) =>
            pipeline?.metadata?.labels[PipelineRunLabel.SNAPSHOT] ===
            snapshotsEnvironmentBinding.spec.snapshot,
        )
      : undefined;

    const status = testPipeline
      ? pipelineRunStatusToGitOpsStatus(pipelineRunStatus(testPipeline))
      : GitOpsDeploymentHealthStatus.Missing;

    return [
      status,
      getGitOpsDeploymentHealthStatusIcon(status),
      testPipeline?.status?.completionTime,
      true,
    ];
  }, [allLoaded, applicationName, snapshotsEnvironmentBindings, environmentName, testPipelines]);
};
