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
  };
  image?: {
    containerImage: string;
  };
};

export type ComponentKind = K8sResourceCommon & {
  spec: {
    componentName: string;
    application: string;
    source: ComponentSource;
    context?: string;
    resources?: ResourceRequirements;
    replicas?: number;
    targetPort?: number;
    route?: string;
    env?: {
      name: string;
      value: string;
    }[];
    build?: {
      containerImage: string;
    };
  };
  status?: {
    containerImage?: string;
    conditions?: any;
    devfile?: string;
    gitops?: { repositoryURL?: string };
  };
};
