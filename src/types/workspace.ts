import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export interface Workspace extends K8sResourceCommon {
  status: {
    type: string;
    namespaces: Namespace[];
    owner: string;
    role: string;
  };
}

export interface Namespace {
  name: string;
  type?: string;
}
