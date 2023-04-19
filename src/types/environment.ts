import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type EnvironmentKind = K8sResourceCommon & {
  spec: {
    configuration?: {
      env: { name: string; value: string }[];
    };
    deploymentStrategy: string;
    displayName: string;
    parentEnvironment?: string;
    tags?: string[];
    type?: string;
    unstableConfigurationFields?: {
      kubernetesCredentials?: {
        allowInsecureSkipTLSVerify: boolean;
        apiURL: string;
        clusterCredentialsSecret: string;
        targetNamespace: string;
      };
    };
  };
  status?: {};
};
