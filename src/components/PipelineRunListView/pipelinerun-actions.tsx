import { pipelineRunFilterReducer } from '../../shared';
import { Action } from '../../shared/components/action-menu/types';
import { PipelineRunKind } from '../../types';
import { pipelineRunCancel, pipelineRunreRun, pipelineRunStop } from '../../utils/pipeline-actions';

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  return [
    {
      cta: () => pipelineRunreRun(pipelineRun),
      id: 'pipelinerun-rerun',
      label: 'Rerun',
    },
    {
      cta: () => pipelineRunStop(pipelineRun),
      id: 'pipelinerun-stop',
      label: 'Stop',
      tooltip: 'Let the running tasks complete, then execute finally tasks',
      disabled: !(pipelineRunFilterReducer(pipelineRun) === 'Running'),
    },

    {
      cta: () => pipelineRunCancel(pipelineRun),
      id: 'pipelinerun-cancel',
      label: 'Cancel',
      tooltip: 'Interrupt any executing non finally tasks, then execute finally tasks',
      disabled: !(pipelineRunFilterReducer(pipelineRun) === 'Running'),
    },
  ];
};
