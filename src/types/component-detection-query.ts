import { K8sResourceCommon } from '../dynamic-plugin-sdk';

export type ComponentDetectionQueryKind = K8sResourceCommon & {
  spec: {
    git: {
      url: string;
    };
  };
  isMultiComponent?: boolean;
  status?: {
    componentDetected?: {
      [key: string]: {
        componentStub: {
          componentName: string;
          context: string;
          targetPort: number;
          replicas?: number;
          devfileFound?: boolean;
          route?: string;
          build?: {
            containerImage: string;
          };
          resources: {
            limits?: {
              cpu?: string;
              memory?: string;
            };
            requests?: {
              cpu?: string;
              memory?: string;
            };
          };
          source: {
            git: {
              url: string;
            };
          };
          env?: { name: string; value: string }[];
        };
      };
    };
    conditions?: any[];
  };
};
