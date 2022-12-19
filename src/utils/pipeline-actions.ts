import { k8sCreateResource, k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunModel } from '../models';
import { PipelineRunKind } from '../types/pipeline-run';
import { getPipelineRunData } from './pipeline-utils';

export const pipelineRunreRun = (pipelineRun: PipelineRunKind) => {
  const pipelineRunData = getPipelineRunData(pipelineRun);

  return k8sCreateResource({
    model: PipelineRunModel,
    queryOptions: {
      name: pipelineRunData.metadata.name,
      ns: pipelineRun.metadata.namespace,
    },
    resource: pipelineRunData,
  });
};

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
