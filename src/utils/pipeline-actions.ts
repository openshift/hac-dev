import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunModel } from '../models';
import { PipelineRunKind } from '../shared/components/pipeline-run-logs/types';

export const pipelineRunStop = (pipelineRun: PipelineRunKind) => {
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
        value: 'StoppedRunFinally',
      },
    ],
  });
};

export const pipelineRunCancel = (pipelineRun: PipelineRunKind) => {
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
        value: 'CancelledRunFinally',
      },
    ],
  });
};
