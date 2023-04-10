import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type SecretKind = K8sResourceCommon & {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
};
