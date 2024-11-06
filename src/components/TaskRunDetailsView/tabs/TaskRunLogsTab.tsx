import * as React from 'react';
import { TaskRunKind } from '../../../types';
import { taskRunStatus } from '../../../utils/pipeline-utils';
import TaskRunLogs from '../../TaskRuns/TaskRunLogs';

export type TaskRunLogProps = {
  taskRun: TaskRunKind;
  pipelineRunUID: string;
};

const TaskRunLogsTab: React.FC<React.PropsWithChildren<TaskRunLogProps>> = ({
  taskRun,
  pipelineRunUID,
}) => {
  const status = taskRunStatus(taskRun);
  const namespace = taskRun.metadata?.namespace;

  return (
    <TaskRunLogs
      taskRun={taskRun}
      status={status}
      namespace={namespace}
      pipelineRunUID={pipelineRunUID}
    />
  );
};

export default TaskRunLogsTab;
