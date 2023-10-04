import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type SpaceBindingRequest = K8sResourceCommon & {
  spec: {
    masterUserRecord: string;
    spaceRole: 'contributor' | 'maintainer' | 'owner';
  };
  status?: {
    conditions?: {
      reason?: string;
      message?: string;
      status?: string;
      ready?: string;
    }[];
  };
};
