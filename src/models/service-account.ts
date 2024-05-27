import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const ServiceAccountModel: K8sModelCommon = {
  apiVersion: 'v1',
  plural: 'serviceaccounts',
  namespaced: true,
  kind: 'ServiceAccount',
};

export const ServiceAccountGroupVersionKind: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'ServiceAccount',
};
