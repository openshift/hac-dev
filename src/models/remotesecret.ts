import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const RemoteSecretModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1beta1',
  plural: 'remotesecrets',
  namespaced: true,
  kind: 'RemoteSecret',
};

export const RemoteSecretGroupVersionKind: K8sGroupVersionKind = {
  version: 'v1beta1',
  kind: 'RemoteSecret',
};
