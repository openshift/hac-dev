import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type EnvironmentKind = K8sResourceCommon & {
  spec: {
    displayName: string;
    clusterCredentials?: {
      apiServerURL: string;
      credentials?: string;
    };
    deploymentStrategy?: string;
    parentEnvironment?: string;
    type?: string;
    tags?: string[];
  };
  status?: {};
};
