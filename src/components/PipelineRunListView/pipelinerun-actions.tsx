import { pipelineRunCancel, pipelineRunStop } from '../../hacbs/utils/pipeline-actions';
import { pipelineRunFilterReducer } from '../../shared';
import { Action } from '../../shared/components/action-menu/types';
import { PipelineRunKind } from '../../types';

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  return [
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
