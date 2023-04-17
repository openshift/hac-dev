import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type DeploymentKind = {
  spec: {};
  status: {};
} & K8sResourceCommon;
