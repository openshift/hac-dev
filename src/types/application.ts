import { K8sResourceCommon } from '../dynamic-plugin-sdk';

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
