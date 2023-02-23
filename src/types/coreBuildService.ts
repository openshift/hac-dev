import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { Condition } from './pipeline-run';

export type IntegrationTestScenarioKind = K8sResourceCommon & {
  spec: IntegrationTestScenarioSpec;
};

export type IntegrationTestScenarioSpec = {
  application: string;
  bundle: string;
  pipeline: string;
  contexts?: Context[];
  environment?: Environment;
  params?: Param[];
};

export type Context = {
  description: string;
  name: string;
};

export type Environment = {
  name: string;
  params: any[];
  type: string;
};

export type Param = {
  name: string;
  value: string[];
};

export type EnvironmentKind = K8sResourceCommon & {
  spec: EnvironmentSpec;
};

export type EnvironmentSpec = {
  type: string;
  deploymentStrategy: string;
  displayName: string;
  parentEnvironment?: string;
  tags?: string[];
  configuration?: Configuration;
};

export type Configuration = {
  env: Env[];
  replicas?: number;
};

export type Env = {
  name: string;
  value: string;
};

export type ReleaseKind = K8sResourceCommon & {
  spec: ReleaseSpec;
  status: ReleaseStatus;
};

export type ReleaseSpec = {
  snapshot: string;
  releasePlan: string;
};

export type ReleaseStatus = {
  startTime?: string;
  completionTime?: string;
  conditions?: Condition[];
  snapshotEnvironmentBinding?: string;
  releasePipelineRun?: string;
  releaseStrategy?: string;
  target?: string;
};

export type ReleasePlanKind = K8sResourceCommon & {
  spec: ReleasePlanSpec;
};

export type ReleasePlanSpec = {
  displayName: string;
  application: string;
  target: ReleaseTarget;
  releaseStrategy?: string;
};

export type ReleaseTarget = {
  workspace?: string;
  namespace: string;
};

export type component = {
  name: string;
  configuration: Configuration;
};

export type Snapshot = K8sResourceCommon & {
  spec: {
    application: string;
    displayName?: string;
    displayDescription?: string;
    components: {
      containerImage: string;
      name: string;
    }[];
    artifacts?: {
      [key: string]: unknown;
    };
  };
  status?: {
    conditions: Condition[];
  };
};
export interface GitopsRepository {
  branch: string;
  commitID: string;
  generatedResources: string[];
  path: string;
  url: string;
}

export interface GitopsDeployment {
  componentName: string;
  gitopsDeployment: string;
}

export type SnapshotEnvironmentBinding = K8sResourceCommon & {
  spec: {
    application: string;
    components: component[];
    environment: string;
    snapshot: string;
  };
  status?: {
    bindingConditions?: Condition[];
    componentDeploymentConditions?: Condition[];
    components?: {
      gitopsRepository: GitopsRepository;
      name: string;
    }[];
    gitopsDeployments?: GitopsDeployment[];
    gitopsRepoConditions?: Condition[];
  };
};
