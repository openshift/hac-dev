import * as React from 'react';
import { PipelineRunKind } from '../../../types';
import TaskRunListView from '../../TaskRunListView/TaskRunListView';

type PipelineRunTaskRunsTabProps = {
  pipelineRun: PipelineRunKind;
};

const PipelineRunTaskRunsTab: React.FC<PipelineRunTaskRunsTabProps> = ({ pipelineRun }) =>
  pipelineRun && Object.keys(pipelineRun).length ? (
    <TaskRunListView
      pipelineName={pipelineRun.metadata.name}
      namespace={pipelineRun.metadata.namespace}
    />
  ) : null;

export default PipelineRunTaskRunsTab;
