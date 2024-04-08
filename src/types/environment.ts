import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
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
      clusterType?: string;
      kubernetesCredentials?: {
        allowInsecureSkipTLSVerify: boolean;
        apiURL: string;
        clusterCredentialsSecret: string;
        targetNamespace: string;
        namespaces?: string[];
      };
    };
  };
  status?: {};
};
