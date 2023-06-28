import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export enum ReleaseCondition {
  Processed = 'Processed',
  Validated = 'Validated',
  Released = 'Released',
}

export type ReleaseKind = K8sResourceCommon & {
  spec: {
    releasePlan: string;
    snapshot: string;
  };
  status?: {
    startTime?: string;
    completionTime?: string;
    automated?: boolean;
    processing?: {
      target?: string;
      pipelineRun?: string;
      releaseStrategy?: string;
    };
    conditions?: {
      type?: ReleaseCondition;
      reason?: string;
      status?: string;
      message?: string;
    }[];
  };
};
