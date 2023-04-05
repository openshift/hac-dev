import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { EdgeModel, PipelineNodeModel } from '@patternfly/react-topology';
import { Commit, ComponentKind, EnvironmentKind, PipelineRunKind } from '../../../../../types';
import {
  IntegrationTestScenarioKind,
  ReleaseKind,
  ReleasePlanKind,
} from '../../../../../types/coreBuildService';
import { runStatus } from '../../../../../utils/pipeline-utils';
import { NodeType } from './const';

export enum WorkflowNodeType {
  COMPONENT,
  BUILD,
  TESTS,
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
  releaseStatus: runStatus;
  buildPipelinestatus: runStatus;
  releasePlanStatus: (rp: ReleasePlanKind) => runStatus;
  environmentStatus: (env: EnvironmentKind) => runStatus;
  integrationTestStatus: (test: IntegrationTestScenarioKind) => runStatus;
  applicationIntegrationTests: IntegrationTestScenarioKind[];
  compReleases: ReleaseKind[];
  compReleasePlans: ReleasePlanKind[];
  compEnvironments: EnvironmentKind[];
};

export type Workflow = {
  [key: string]: {
    id: string;
    isAbstractNode?: boolean;
    data: {
      status?: runStatus | ((s: any) => runStatus);
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
  workflowType: WorkflowNodeType;
  isDisabled?: boolean;
  groupNode?: boolean;
  status?: runStatus;
  resources?: K8sResourceCommon[];
  hidden?: boolean;
  children?: PipelineNodeModel[];
  isParallelNode?: boolean;
};

// Graph Models
export type WorkflowNodeModel<D extends WorkflowNodeModelData> = PipelineNodeModel & {
  data: D;
  type: NodeType;
};
export type PipelineMixedNodeModel = WorkflowNodeModel<WorkflowNodeModelData> | PipelineNodeModel;

export type PipelineEdgeModel = EdgeModel;
