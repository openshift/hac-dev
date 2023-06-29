import React from 'react';
import { PodGroupVersionKind } from '../../models/pod';
import LogsWrapperComponent from '../../shared/components/pipeline-run-logs/logs/LogsWrapperComponent';
import { TaskRunKind } from '../../types';
import { runStatus } from '../../utils/pipeline-utils';

type Props = {
  taskRun: TaskRunKind;
  namespace: string;
  status: runStatus;
};

const TaskRunLogs: React.FC<Props> = ({ taskRun, namespace, status }) => {
  const podName = taskRun?.status?.podName;

  if (status === runStatus.Skipped) {
    return <div>No logs. This task was skipped.</div>;
  }
  if (status === runStatus.Idle) {
    return <div>Waiting on task to start.</div>;
  }
  if (!podName) {
    return <div data-test="taskrun-logs-nopod">No logs found.</div>;
  }
  return (
    <LogsWrapperComponent
      taskRun={taskRun}
      resource={{
        name: podName,
        groupVersionKind: PodGroupVersionKind,
        namespace,
        isList: false,
      }}
    />
  );
};

export default TaskRunLogs;
