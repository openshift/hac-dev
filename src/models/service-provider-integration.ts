import { K8sGroupVersionKind, K8sModel } from './../dynamic-plugin-sdk';

export const SPIAccessTokenBindingModel: K8sModel = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1beta1',
  kind: 'SPIAccessTokenBinding',
  plural: 'spiaccesstokenbindings',
  abbr: 'ATB',
  label: 'SPIAccessTokenBinding',
  labelPlural: 'SPIAccessTokenBindings',
  namespaced: true,
};

export const SPIAccessTokenBindingGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1beta1',
  kind: 'SPIAccessTokenBinding',
};
