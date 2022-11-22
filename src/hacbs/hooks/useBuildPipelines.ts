import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';

export const useBuildPipelines = (
  namespace: string,
  applicationName: string,
  commit?: string,
): [PipelineRunKind[], boolean, unknown] =>
  useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
        [PipelineRunLabel.APPLICATION]: applicationName,
        ...(commit && { [PipelineRunLabel.COMMIT_LABEL]: commit }),
      },
    },
    isList: true,
  });
