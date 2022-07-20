import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type PipelineResourceKind = K8sResourceCommon & {
  spec: {
    params: { name: string; value: string }[];
    type: string;
  };
};
