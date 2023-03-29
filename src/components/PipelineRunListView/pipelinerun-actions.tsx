import { PipelineRunModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { PipelineRunKind } from '../../types';
import { pipelineRunCancel, pipelineRunStop } from '../../utils/pipeline-actions';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  const [canPatchPipelineRun] = useAccessReviewForModel(PipelineRunModel, 'patch');

  return [
    // Todo: will re enable this after finding the proper solution to rerun post mvp.
    // {
    //   cta: () => pipelineRunRerun(pipelineRun),
    //   id: 'pipelinerun-rerun',
    //   label: 'Rerun',
    // },
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
