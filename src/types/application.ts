import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type ApplicationKind = K8sResourceCommon & {
  spec: {
    displayName: string;
    appModelRepository?: {
      url: string;
    };
    gitOpsRepository?: {
      url: string;
    };
  };
};
