import { RunStatus, WhenStatus } from '@patternfly/react-topology';
import { PipelineNodeModel as PfPipelineNodeModel } from '@patternfly/react-topology/dist/esm/pipelines/types';
import { PipelineTask } from '../../../types';

export enum PipelineRunNodeType {
  SPACER_NODE = 'spacer-node',
  FINALLY_NODE = 'finally-node',
  FINALLY_GROUP = 'finally-group',
  TASK_NODE = 'pipelinerun-task-node',
  EDGE = 'pipelinerun-edge',
}

export type StepStatus = {
  name: string;
  duration: string | null;
  status: RunStatus;
};

export type PipelineRunNodeData = {
  task: PipelineTask;
  status?: RunStatus;
  testFailCount?: number;
  testWarnCount?: number;
  whenStatus?: WhenStatus;
  steps?: StepStatus[];
  description?: string;
};

export type PipelineTaskWithStatus = PipelineTask & {
  status: {
    reason: RunStatus;
  };
};

export type PipelineRunNodeModel<D extends PipelineRunNodeData, T> = Omit<
  PfPipelineNodeModel,
  'type'
> & {
  data: D;
  type: T;
};
