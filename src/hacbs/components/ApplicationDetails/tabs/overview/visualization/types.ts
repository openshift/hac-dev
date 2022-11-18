import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { EdgeModel, PipelineNodeModel } from '@patternfly/react-topology';
import { NodeType } from './const';

export enum WorkflowNodeType {
  COMPONENT,
  BUILD,
  TESTS,
  COMPONENT_TEST,
  APPLICATION_TEST,
  STATIC_ENVIRONMENT,
  RELEASE,
  MANAGED_ENVIRONMENT,
}

export type WorkflowNodeModelData = {
  label: string;
  workflowType: WorkflowNodeType;
  isDisabled?: boolean;
  groupNode?: boolean;
  status?: string;
  resources?: K8sResourceCommon[];
  hidden?: boolean;
  children?: PipelineNodeModel[];
};

// Graph Models
export type WorkflowNodeModel<D extends WorkflowNodeModelData> = PipelineNodeModel & {
  data: D;
  type: NodeType;
};
export type PipelineMixedNodeModel = WorkflowNodeModel<WorkflowNodeModelData> | PipelineNodeModel;

export type PipelineEdgeModel = EdgeModel;
