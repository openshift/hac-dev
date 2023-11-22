import * as React from 'react';
import { TaskRunKind } from '../../../../types';
import { calculateDuration } from '../../../../utils/pipeline-utils';

interface LogsTaskDurationProps {
  taskRun: TaskRunKind;
}

const LogsTaskDuration: React.FC<LogsTaskDurationProps> = ({ taskRun }) => {
  const duration =
    taskRun?.status?.startTime &&
    calculateDuration(taskRun.status.startTime, taskRun.status.completionTime);

  return duration ? (
    <span data-test="logs-task-duration" className="pf-v5-u-ml-md">
      [Duration: {duration}]
    </span>
  ) : null;
};

export default LogsTaskDuration;
