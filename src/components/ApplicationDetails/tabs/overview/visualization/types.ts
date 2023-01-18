import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { EdgeModel, PipelineNodeModel, RunStatus } from '@patternfly/react-topology';
import { Commit, ComponentKind, EnvironmentKind, PipelineRunKind } from '../../../../../types';
import {
  IntegrationTestScenarioKind,
  ReleaseKind,
  ReleasePlanKind,
} from '../../../../../types/coreBuildService';
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
  PIPELINE,
  COMMIT,
}

export type WorkflowResource =
  | ComponentKind
  | IntegrationTestScenarioKind
  | PipelineRunKind
  | EnvironmentKind
  | ReleaseKind
  | ReleasePlanKind
  | Commit;

export type WorkflowResources =
  | ComponentKind[]
  | IntegrationTestScenarioKind[]
  | PipelineRunKind[]
  | EnvironmentKind[]
  | ReleaseKind[]
  | ReleasePlanKind[]
  | Commit[];

export type CommitWorkflow = {
  [key: string]: Workflow;
};

export type CommitComponentResource = {
  component: ComponentKind;
  releaseStatus: RunStatus;
  buildPipelinestatus: RunStatus;
  releasePlanStatus: (rp: ReleasePlanKind) => RunStatus;
  environmentStatus: (env: EnvironmentKind) => RunStatus;
  integrationTestStatus: (test: IntegrationTestScenarioKind) => RunStatus;
  compIntegrationTestScenarios: IntegrationTestScenarioKind[];
  compReleases: ReleaseKind[];
  compReleasePlans: ReleasePlanKind[];
  compEnvironments: EnvironmentKind[];
};

export type Workflow = {
  [key: string]: {
    id: string;
    isAbstractNode?: boolean;
    data: {
      status?: RunStatus | ((s: any) => RunStatus);
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
  application?: string;
  label: string;
  workflowType: WorkflowNodeType;
  isDisabled?: boolean;
  groupNode?: boolean;
  runAfterTasks?: string[];
  status?: string;
  resources?: K8sResourceCommon[];
  hidden?: boolean;
  children?: PipelineNodeModel[];
  isParallelNode?: boolean;
  width?: number;
};

export type WorkflowNode = {
  id: string;
  data: WorkflowNodeModelData;
};

// Graph Models
export type WorkflowNodeModel<D extends WorkflowNodeModelData> = PipelineNodeModel & {
  data: D;
  type: NodeType;
};
export type PipelineMixedNodeModel = WorkflowNodeModel<WorkflowNodeModelData> | PipelineNodeModel;

export type PipelineEdgeModel = EdgeModel;
