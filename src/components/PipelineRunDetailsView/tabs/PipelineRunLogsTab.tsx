import * as React from 'react';
import { PipelineRunLogs } from '../../../shared';
import { PipelineRunKind, TaskRunKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

type PipelineRunLogsTabProps = {
  pipelineRun: PipelineRunKind;
  taskRuns: TaskRunKind[];
};

const PipelineRunLogsTab: React.FC<PipelineRunLogsTabProps> = ({ pipelineRun, taskRuns }) => {
  const { workspace } = useWorkspaceInfo();
  return (
    <PipelineRunLogs
      className="pf-u-pt-md"
      obj={pipelineRun}
      taskRuns={taskRuns}
      workspace={workspace}
    />
  );
};

export default PipelineRunLogsTab;
