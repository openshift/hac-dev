import * as React from 'react';
import { TaskRunKind } from '../../../types';
import TaskRunListView from '../../TaskRunListView/TaskRunListView';

type PipelineRunTaskRunsTabProps = {
  taskRuns: TaskRunKind[];
  loaded: boolean;
};

const PipelineRunTaskRunsTab: React.FC<React.PropsWithChildren<PipelineRunTaskRunsTabProps>> = ({
  taskRuns,
  loaded,
}) => <TaskRunListView taskRuns={taskRuns} loaded={loaded} />;

export default PipelineRunTaskRunsTab;
