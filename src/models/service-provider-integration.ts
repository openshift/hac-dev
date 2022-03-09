import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const SPIAccessTokenBindingModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1beta1',
  kind: 'SPIAccessTokenBinding',
  plural: 'spiaccesstokenbindings',
  namespaced: true,
};

export const SPIAccessTokenBindingGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1beta1',
  kind: 'SPIAccessTokenBinding',
};
