import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';

export const useBuildPipelines = (
  namespace: string,
  applicationName: string,
): [PipelineRunKind[], boolean, unknown] =>
  useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        ['build.appstudio.openshift.io/type']: 'build',
        ['build.appstudio.openshift.io/application']: applicationName,
      },
    },
    isList: true,
  });
