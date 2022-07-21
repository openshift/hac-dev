import { EdgeModel, PipelineNodeModel } from '@patternfly/react-topology';
import { ComponentKind } from '../../../../../../types';
import { PipelineRunKind } from '../../../../../types';
import {
  EnvironmentKind,
  IntegrationTestScenarioKind,
  ReleaseLinkKind,
} from '../../../../../types/coreBuildService';
import { NodeType } from './const';

export enum WorkflowNodeType {
  SOURCE = 'source',
  PIPELINE = 'pipeline',
  ENVIRONMENT = 'environment',
}

export type WorkflowResources =
  | ComponentKind[]
  | IntegrationTestScenarioKind[]
  | PipelineRunKind[]
  | EnvironmentKind[]
  | ReleaseLinkKind[];

export type Workflow = {
  [key: string]: {
    id: string;
    isAbstractNode?: boolean;
    data: {
      label: string;
      workflowType: WorkflowNodeType;
      isDisabled: boolean;
      resources: WorkflowResources;
    };
    runBefore: string[];
    runAfter: string[];
    runAfterResourceKey?: string;
  };
};

export type WorkflowNodeModelData = {
  id: string;
  workflowType: WorkflowNodeType;
  runAfterTasks: string[];
  label?: string;
  selected?: boolean;
  isDisabled?: boolean;
};

export type NodeData = {
  id: string;
  workflowType: WorkflowNodeType;
  resources: WorkflowResources;
  isDisabled: boolean;
  label: string;
  runAfterTasks: string[];
};

export type WorkflowNode = {
  id: string;
  data: NodeData;
};

// Graph Models
export type WorkflowNodeModel<D extends WorkflowNodeModelData> = PipelineNodeModel & {
  data: D;
  type: NodeType;
};
export type PipelineMixedNodeModel = WorkflowNodeModel<WorkflowNodeModelData> | PipelineNodeModel;

export type PipelineEdgeModel = EdgeModel;

// Node Creators
export type NodeCreator<D extends WorkflowNodeModelData> = (
  name: string,
  data: D,
) => WorkflowNodeModel<D>;

export type NodeCreatorSetup = (
  type: NodeType,
  width?: number,
  height?: number,
) => NodeCreator<WorkflowNodeModelData>;
