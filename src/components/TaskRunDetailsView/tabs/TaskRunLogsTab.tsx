import * as React from 'react';
import { WatchK8sResource } from '../../../dynamic-plugin-sdk';
import { PodGroupVersionKind } from '../../../models/pod';
import { ErrorDetailsWithStaticLog } from '../../../shared/components/pipeline-run-logs/logs/log-snippet-types';
import LogsWrapperComponent from '../../../shared/components/pipeline-run-logs/logs/LogsWrapperComponent';
import { getTRLogSnippet } from '../../../shared/components/pipeline-run-logs/logs/pipelineRunLogSnippet';
import { TaskRunKind } from '../../../types';
import { runStatus, taskRunStatus } from '../../../utils/pipeline-utils';

import './TaskRunLogs.scss';

export type TaskRunLogProps = {
  taskRun: TaskRunKind;
};

const TaskRunLog: React.FC<TaskRunLogProps> = ({ taskRun }) => {
  const podName = taskRun?.status?.podName;
  const taskName = taskRun.spec.taskRef?.name;
  const hasTaskRunFinished = taskRunStatus(taskRun) !== runStatus.Running;
  const logDetails = getTRLogSnippet(taskRun) as ErrorDetailsWithStaticLog;

  const resource: WatchK8sResource = podName && {
    name: podName,
    groupVersionKind: PodGroupVersionKind,
    namespace: taskRun.metadata.namespace,
    isList: false,
  };

  return (
    <div className="taskrun-logs">
      {resource ? (
        <LogsWrapperComponent resource={resource} taskName={taskName} />
      ) : (
        <div className="taskrun-logs__log">
          <div className="taskrun-logs__logtext" data-testid="task-logs-error">
            {(!resource && hasTaskRunFinished && taskRun.status?.conditions[0]?.message) ||
              'No logs found'}
            {logDetails && (
              <div className="taskrun-logs__logsnippet">{logDetails.staticMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRunLog;
