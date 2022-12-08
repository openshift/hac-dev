import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel, PipelineRunType } from '../hacbs/consts/pipelinerun';
import { PipelineRunKind } from '../hacbs/types';
import { PipelineRunGroupVersionKind } from '../shared';

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
        [PipelineRunLabel.TEST_SERVICE_APPLICATION]: applicationName,
        ...(commit && { [PipelineRunLabel.COMMIT_LABEL]: commit }),
      },
    },
    isList: true,
  });
