import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../models';
import { PipelineRunKind } from '../types';

export const useTestPipelines = (
  namespace: string,
  applicationName: string,
  commit?: string,
): [PipelineRunKind[], boolean, unknown] =>
  useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
        [PipelineRunLabel.APPLICATION]: applicationName,
        ...(commit && { [PipelineRunLabel.TEST_SERVICE_COMMIT]: commit }),
      },
    },
    isList: true,
  });
