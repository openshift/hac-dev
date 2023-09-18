import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type ReleaseStrategySpec = {
  bundle?: string;
  params?: { name: string; value?: string; values?: string }[];
  pipeline: string;
  policy: string;
  serviceAccount?: string;
  persistentVolumeClaim?: string;
};

export type ReleaseStrategyKind = K8sResourceCommon & {
  spec: ReleaseStrategySpec;
};
