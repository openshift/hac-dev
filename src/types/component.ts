import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type ResourceRequirements = {
  requests?: {
    memory: string;
    cpu: string;
  };
  limits?: {
    memory: string;
    cpu: string;
  };
};

export type ComponentSource = {
  git?: {
    url: string;
    devfileUrl?: string;
    dockerfileUrl?: string;
    revision?: string;
    context?: string;
  };
};

export type ComponentSpecs = {
  componentName: string;
  application: string;
  secret?: string;
  source?: ComponentSource;
  containerImage?: string;
  resources?: ResourceRequirements;
  replicas?: number;
  releaseStrategies?: string[];
  targetPort?: number;
  route?: string;
  env?: {
    name: string;
    value: string;
  }[];
};

export type ComponentKind = K8sResourceCommon & {
  spec: ComponentSpecs;
  status?: {
    containerImage?: string;
    conditions?: any;
    devfile?: string;
    gitops?: { repositoryURL?: string; branch?: string; context?: string };
    webhook?: string;
  };
};
