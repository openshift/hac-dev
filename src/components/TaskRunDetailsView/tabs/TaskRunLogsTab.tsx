import * as React from 'react';
import { TaskRunKind } from '../../../types';
import { taskRunStatus } from '../../../utils/pipeline-utils';
import TaskRunLogs from '../../TaskRuns/TaskRunLogs';

export type TaskRunLogProps = {
  taskRun: TaskRunKind;
};

const TaskRunLogsTab: React.FC<React.PropsWithChildren<TaskRunLogProps>> = ({ taskRun }) => {
  const status = taskRunStatus(taskRun);
  const namespace = taskRun.metadata?.namespace;

  return <TaskRunLogs taskRun={taskRun} status={status} namespace={namespace} />;
};

export default TaskRunLogsTab;
