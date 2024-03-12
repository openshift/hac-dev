import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { Condition } from './pipeline-run';

export enum ResolverType {
  GIT = 'git',
  BUNDLES = 'bundles',
}
export type IntegrationTestScenarioKind = K8sResourceCommon & {
  spec: IntegrationTestScenarioSpec;
};

export type ResolverParam = {
  name: string;
  value: string;
};

export type IntegrationTestScenarioSpec = {
  application: string;
  contexts?: Context[];
  environment?: Environment;
  params?: Param[];
  resolverRef?: {
    resolver: ResolverType;
    params: ResolverParam[];
  };
  pipeline?: string;
  bundle?: string;
};

export type Context = {
  description: string;
  name: string;
};

export type Environment = {
  name: string;
  params?: any[];
  type?: string;
  configuration?: {
    env: { name: string; value: string }[];
  };
};

export type Param = {
  name: string;
  value?: string;
  values?: string[];
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

export type CVE = {
  issueKey: string;
  url: string;
  status?: string;
  summary?: string;
  uploadDate?: string;
  components?: string[];
};

export type Issue = {
  issueKey: string;
  url: string;
  status?: string;
  summary?: string;
  uploadDate?: string;
};

export type ReleaseKind = K8sResourceCommon & {
  spec: ReleaseSpec;
  status?: ReleaseStatus;
};

export type ReleaseSpec = {
  snapshot: string;
  releasePlan: string;
  data?: {
    releaseNotes?: {
      topic?: string;
      description: string;
      synopsis: string;
      cves: CVE[];
      issues: Issue[];
      solution?: string;
      references?: string;
    };
  };
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
  application: string;
  target: string;
  data?: any;
  pipelineRef?: {
    resolver: ResolverType;
    params: Param[];
  };
  serviceAccount?: string;
};

export const ReleasePlanLabel = {
  AUTO_RELEASE: 'release.appstudio.openshift.io/auto-release',
  STANDING_ATTRIBUTION: 'release.appstudio.openshift.io/standing-attribution',
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
      source?: {
        git?: {
          url: string;
          revision: string;
        };
      };
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
  health?: string;
  syncStatus?: string;
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

export type LimitRange = K8sResourceCommon & {
  spec: {
    limits: Limit[];
  };
};

export interface Limit {
  default: Default;
  defaultRequest: Default;
  type: string;
}

export interface Default {
  cpu: string;
  memory: string;
}
