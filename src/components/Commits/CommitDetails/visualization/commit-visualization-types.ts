import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineNodeModel } from '@patternfly/react-topology';
import { Commit } from '../../../../types';
import { runStatus } from '../../../../utils/pipeline-utils';

export enum NodeType {
  WORKFLOW_NODE = 'workflow-node',
  SPACER_NODE = 'spacer-node',
}

export enum CommitWorkflowNodeType {
  BUILD,
  APPLICATION_TEST,
  STATIC_ENVIRONMENT,
  RELEASE,
  MANAGED_ENVIRONMENT,
  COMMIT,
}

export type CommitWorkflowNodeModelData = {
  workflowType: CommitWorkflowNodeType;
  status?: runStatus;
  application: string;
  resource?: K8sResourceCommon | Commit;
};

export type CommitWorkflowNodeModel = PipelineNodeModel & {
  data: CommitWorkflowNodeModelData;
  type: NodeType;
};
