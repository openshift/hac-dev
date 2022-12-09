import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type EnterpriseContractPolicyKind = K8sResourceCommon & {
  spec: {
    description?: string;
    sources: {
      git?: {
        repository: string;
        revision?: string;
      };
    }[];
    exceptions?: {
      nonBlocking?: string[];
    };
    authorization?: {
      changeId?: string;
      repository?: string;
      authorizer?: string;
    };
    rekorUrl?: string;
    publicKey?: string;
  };
};
