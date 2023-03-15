import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { TaskRunGroupVersionKind, TaskRunKind, TektonResourceLabel } from '../types';

export const useTaskRuns = (
  namespace: string,
  pipelineRunName: string,
): [TaskRunKind[], boolean, unknown] =>
  useK8sWatchResource<TaskRunKind[]>({
    groupVersionKind: TaskRunGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        [TektonResourceLabel.pipelinerun]: pipelineRunName,
      },
    },
    isList: true,
  });
