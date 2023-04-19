import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const SecretModel: K8sModelCommon = {
  apiVersion: 'v1',
  plural: 'secrets',
  namespaced: true,
  kind: 'Secret',
};

export const SecretGroupVersionKind: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'Secret',
};
