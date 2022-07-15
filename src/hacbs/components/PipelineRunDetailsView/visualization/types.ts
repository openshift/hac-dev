import { RunStatus } from '@patternfly/react-topology';
import { PipelineTask } from '../../../types';
import { NodeModel } from '../../topology/utils/create-utils';

export enum PipelineRunNodeType {
  SPACER_NODE = 'spacer-node',
  FINALLY_NODE = 'finally-node',
  FINALLY_GROUP = 'finally-group',
  TASK_NODE = 'pipelinerun-task-node',
  EDGE = 'pipelinerun-edge',
}

export type PipelineRunNodeData = {
  id: string;
  task: PipelineTask;
  runAfterTasks: string[];
  label?: string;
  selected?: boolean;
  isDisabled?: boolean;
  width?: number;
  height?: number;
  status?: RunStatus;
  whenStatus?: string;
};

export type PipelineRunNode = (
  type: PipelineRunNodeType,
  data: PipelineRunNodeData,
) => NodeModel<PipelineRunNodeData, PipelineRunNodeType>;

export type PipelineTaskWithStatus = PipelineTask & {
  status: {
    reason: RunStatus;
  };
};
