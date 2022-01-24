import { K8sResourceCommon } from '../dynamic-plugin-sdk';

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

export type ComponentKind = K8sResourceCommon & {
  spec: {
    componentName: string;
    application: string;
    source: {
      git?: {
        url: string;
      };
    };
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
};
