import * as React from 'react';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { PipelineRunLogs } from '../../../shared';
import { PipelineRunKind, TaskRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type PipelineRunLogsTabProps = {
  pipelineRun: PipelineRunKind;
  taskRuns: TaskRunKind[];
};

const PipelineRunLogsTab: React.FC<React.PropsWithChildren<PipelineRunLogsTabProps>> = ({
  pipelineRun,
  taskRuns,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [activeTask, setActiveTask, unSetActiveTask] = useSearchParam('task', undefined);

  const handleActiveTaskChange = React.useCallback(
    (value: string | undefined) => {
      value ? setActiveTask(value) : unSetActiveTask();
    },
    [setActiveTask, unSetActiveTask],
  );
  return (
    <PipelineRunLogs
      className="pf-v5-u-pt-md"
      obj={pipelineRun}
      taskRuns={taskRuns}
      workspace={workspace}
      activeTask={activeTask}
      onActiveTaskChange={handleActiveTaskChange}
    />
  );
};

export default PipelineRunLogsTab;
