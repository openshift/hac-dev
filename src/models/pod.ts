import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const PodModel: K8sModelCommon = {
  apiVersion: 'v1',
  // t('public~Pod')
  plural: 'pods',
  namespaced: true,
  kind: 'Pod',
  // t('public~Pods')
};

export const PodGroupVersionKind: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'Pod',
};
