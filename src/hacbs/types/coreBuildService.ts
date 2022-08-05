import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

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
};

export type Env = {
  name: string;
  value: string;
};

export type ReleaseLinkKind = K8sResourceCommon & {
  spec: ReleaseLinkSpec;
};

export type ReleaseLinkSpec = {
  displayName: string;
  application: string;
  target: string;
  releaseStrategy?: string;
};
