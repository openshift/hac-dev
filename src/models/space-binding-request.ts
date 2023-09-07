import { K8sGroupVersionKind, K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';

export const SpaceBindingRequestModel: K8sModelCommon = {
  apiVersion: 'v1alpha1',
  apiGroup: 'toolchain.dev.openshift.com',
  kind: 'SpaceBindingRequest',
  plural: 'spacebindingrequests',
};

export const SpaceBindingRequestGroupVersionKind: K8sGroupVersionKind = {
  group: 'toolchain.dev.openshift.com',
  version: 'v1alpha1',
  kind: 'SpaceBindingRequest',
};
