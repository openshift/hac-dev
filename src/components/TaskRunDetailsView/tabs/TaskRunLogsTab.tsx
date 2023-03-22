import * as React from 'react';
import { TaskRunKind } from '../../../types';
import { taskRunStatus } from '../../../utils/pipeline-utils';
import TaskRunLogs from '../../TaskRuns/TaskRunLogs';

export type TaskRunLogProps = {
  taskRun: TaskRunKind;
};

const TaskRunLogsTab: React.FC<TaskRunLogProps> = ({ taskRun }) => {
  const podName = taskRun?.status?.podName;
  const taskName = taskRun?.spec.taskRef?.name ?? taskRun?.metadata.name;
  const status = taskRunStatus(taskRun);
  const namespace = taskRun.metadata?.namespace;

  return (
    <TaskRunLogs podName={podName} taskName={taskName} status={status} namespace={namespace} />
  );
};

export default TaskRunLogsTab;
