import * as React from 'react';
import { PipelineRunLogs } from '../../../shared';
import { PipelineRunKind } from '../../../types';

type PipelineRunLogsTabProps = {
  pipelineRun: PipelineRunKind;
};

const PipelineRunLogsTab: React.FC<PipelineRunLogsTabProps> = ({ pipelineRun }) => (
  <PipelineRunLogs obj={pipelineRun} />
);

export default PipelineRunLogsTab;
