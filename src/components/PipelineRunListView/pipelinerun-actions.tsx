import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PipelineRunLabel, PipelineRunType } from '../../consts/pipelinerun';
import { useComponent } from '../../hooks/useComponents';
import { ComponentModel, PipelineRunModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { PipelineRunKind } from '../../types';
import { isPACEnabled, rerunBuildPipeline } from '../../utils/component-utils';
import { pipelineRunCancel, pipelineRunStop } from '../../utils/pipeline-actions';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const [canPatchPipelineRun] = useAccessReviewForModel(PipelineRunModel, 'patch');
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');

  const [component, componentLoaded, componentError] = useComponent(
    namespace,
    pipelineRun?.metadata?.labels?.[PipelineRunLabel.COMPONENT],
  );

  const runType = React.useMemo(
    () => pipelineRun?.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE],
    [pipelineRun.metadata?.labels],
  );

  return [
    {
      id: 'pipelinerun-rerun',
      label: 'Rerun',
      disabled:
        !canPatchPipelineRun ||
        !canPatchComponent ||
        !isPACEnabled ||
        runType !== PipelineRunType.BUILD,
      disabledTooltip: !canPatchPipelineRun ? "You don't have access to rerun" : null,
      cta: () =>
        componentLoaded &&
        !componentError &&
        runType === PipelineRunType.BUILD &&
        rerunBuildPipeline(component).then(() => {
          navigate(
            `/application-pipeline/workspaces/${workspace}/applications/${component.spec.application}/activity/pipelineruns?name=${component.metadata.name}`,
          );
        }),
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
