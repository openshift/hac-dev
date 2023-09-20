import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type ReleasePlanAdmissionSpec = {
  application: string;
  displayName?: string;
  environment?: string;
  origin: string;
  releaseStrategy: string;
};

export type ReleasePlanAdmissionKind = K8sResourceCommon & {
  spec: ReleasePlanAdmissionSpec;
};
