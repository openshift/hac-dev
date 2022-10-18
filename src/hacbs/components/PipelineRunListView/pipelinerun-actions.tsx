import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { pipelineRunFilterReducer } from '../../../shared/';
import { Action } from '../../../shared/components/action-menu/types';
import { PipelineRunModel } from '../../models/pipelineruns';
import { PipelineRunKind } from '../../types';

export const usePipelinerunActions = (pipelineRun: PipelineRunKind): Action[] => {
  const pipelineRunStop = () => {
    k8sPatchResource({
      model: PipelineRunModel,
      queryOptions: {
        name: pipelineRun.metadata.name,
        ns: pipelineRun.metadata.namespace,
      },
      patches: [
        {
          op: 'replace',
          path: `/spec/status`,
          value: 'PipelineRunCancelled',
        },
      ],
    });
  };

  return [
    {
      cta: () => pipelineRunStop(),
      id: 'pipelinerun-stop',
      label: 'Stop',
      disabled: !(pipelineRunFilterReducer(pipelineRun) === 'Running'),
    },
  ];
};
