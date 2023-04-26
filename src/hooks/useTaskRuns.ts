import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { TaskRunGroupVersionKind, TaskRunKind, TektonResourceLabel } from '../types';

export const useTaskRuns = (
  namespace: string,
  pipelineRunName?: string,
  taskName?: string,
): [TaskRunKind[], boolean, unknown] => {
  const [taskRuns, loaded, error] = useK8sWatchResource<TaskRunKind[]>({
    groupVersionKind: TaskRunGroupVersionKind,
    namespace,
    selector:
      pipelineRunName || taskName
        ? {
            matchLabels: {
              ...(pipelineRunName ? { [TektonResourceLabel.pipelinerun]: pipelineRunName } : {}),
              ...(taskName ? { [TektonResourceLabel.pipelineTask]: taskName } : {}),
            },
          }
        : undefined,
    isList: true,
  });

  const sortedTaskRuns = taskRuns?.sort((a, b) => {
    if (a?.status?.completionTime) {
      return b?.status?.completionTime &&
        new Date(a?.status?.completionTime) > new Date(b?.status?.completionTime)
        ? 1
        : -1;
    }
    return b?.status?.completionTime ||
      new Date(a?.status?.startTime) > new Date(b?.status?.startTime)
      ? 1
      : -1;
  });
  return [sortedTaskRuns, loaded, error];
};
