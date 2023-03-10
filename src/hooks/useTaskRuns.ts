import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { TaskRunGroupVersionKind, TaskRunKind, TektonResourceLabel } from '../types';

export const useTaskRuns = (
  namespace: string,
  pipelineRunName?: string,
  taskName?: string,
): [TaskRunKind[], boolean, unknown] =>
  useK8sWatchResource<TaskRunKind[]>({
    groupVersionKind: TaskRunGroupVersionKind,
    namespace,
    selector: {
      matchLabels: {
        ...(pipelineRunName ? { [TektonResourceLabel.pipelinerun]: pipelineRunName } : {}),
        ...(taskName ? { [TektonResourceLabel.pipelineTask]: taskName } : {}),
      },
    },
    isList: true,
  });
