import * as React from 'react';
import { PipelineRunLogs } from '../../../shared';
import { PipelineRunKind, TaskRunKind } from '../../../types';

type PipelineRunLogsTabProps = {
  pipelineRun: PipelineRunKind;
  taskRuns: TaskRunKind[];
};

const PipelineRunLogsTab: React.FC<PipelineRunLogsTabProps> = ({ pipelineRun, taskRuns }) => (
  <PipelineRunLogs obj={pipelineRun} taskRuns={taskRuns} />
);

export default PipelineRunLogsTab;
