import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PipelineRunLabel, PipelineRunType } from '../../consts/pipelinerun';
import { useComponent } from '../../hooks/useComponents';
import { useSnapshots } from '../../hooks/useSnapshots';
import { ComponentModel, PipelineRunModel, SnapshotModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { PipelineRunKind } from '../../types';
import { startNewBuild } from '../../utils/component-utils';
import { pipelineRunCancel, pipelineRunStop } from '../../utils/pipeline-actions';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { rerunTestPipeline } from '../SnapshotDetails/utils/snapshot-utils';

export const usePipelinererunAction = (pipelineRun: PipelineRunKind) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');
  const [canPatchSnapshot] = useAccessReviewForModel(SnapshotModel, 'patch');

  const [component, componentLoaded, componentError] = useComponent(
    namespace,
    pipelineRun?.metadata?.labels?.[PipelineRunLabel.COMPONENT],
  );

  const [snapshots, snapshotsLoaded, snapshotsError] = useSnapshots(namespace);

  const snapShotLabel = pipelineRun?.metadata?.labels?.[PipelineRunLabel.SNAPSHOT];

  const snapshot = React.useMemo(
    () =>
      snapshotsLoaded &&
      !snapshotsError &&
      snapshots.find((sn) => sn.metadata?.name === snapShotLabel),
    [snapshots, snapshotsLoaded, snapshotsError, snapShotLabel],
  );

  const runType = React.useMemo(
    () => pipelineRun?.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE],
    [pipelineRun?.metadata?.labels],
  );

  const scenario = pipelineRun?.metadata?.labels?.[PipelineRunLabel.TEST_SERVICE_SCENARIO];

  return {
    cta: () =>
      runType === PipelineRunType.BUILD
        ? componentLoaded &&
          !componentError &&
          startNewBuild(component).then(() => {
            navigate(
              `/application-pipeline/workspaces/${workspace}/applications/${component.spec.application}/activity/pipelineruns?name=${component.metadata.name}`,
            );
          })
        : runType === PipelineRunType.TEST &&
          snapshot &&
          scenario &&
          rerunTestPipeline(snapshot, scenario).then(() => {
            navigate(
              `/application-pipeline/workspaces/${workspace}/applications/${component.spec.application}/activity/pipelineruns?name=${component.metadata.name}`,
            );
          }),
    isDisabled:
      (runType === PipelineRunType.BUILD && !canPatchComponent) ||
      (runType === PipelineRunType.TEST && (!canPatchSnapshot || !snapshot || !scenario)),

    disabledTooltip:
      (runType === PipelineRunType.BUILD && !canPatchComponent) ||
      (runType === PipelineRunType.TEST && !canPatchSnapshot)
        ? "You don't have access to rerun"
        : runType === PipelineRunType.TEST && (!snapshot || !scenario)
        ? 'Missing snapshot or scenario'
        : null,
    key: 'rerun',
    label: 'Rerun',
  };
};

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  const { cta, isDisabled, disabledTooltip, key, label } = usePipelinererunAction(pipelineRun);

  const [canPatchPipelineRun] = useAccessReviewForModel(PipelineRunModel, 'patch');

  return [
    {
      id: key,
      label,
      disabled: isDisabled,
      disabledTooltip,
      cta,
    },
    {
      cta: () => pipelineRunStop(pipelineRun),
      id: 'pipelinerun-stop',
      label: 'Stop',
      tooltip: 'Let the running tasks complete, then execute finally tasks',
      disabled: !(pipelineRunStatus(pipelineRun) === runStatus.Running) || !canPatchPipelineRun,
      disabledTooltip: !canPatchPipelineRun
        ? "You don't have access to stop this pipeline"
        : undefined,
    },
    {
      cta: () => pipelineRunCancel(pipelineRun),
      id: 'pipelinerun-cancel',
      label: 'Cancel',
      tooltip: 'Interrupt any executing non finally tasks, then execute finally tasks',
      disabled: !(pipelineRunStatus(pipelineRun) === runStatus.Running) || !canPatchPipelineRun,
      disabledTooltip: !canPatchPipelineRun
        ? "You don't have access to cancel this pipeline"
        : undefined,
    },
  ];
};
