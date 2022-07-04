import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const EnvironmentModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'Environment',
  plural: 'environments',
  namespaced: true,
};

export const EnvironmentGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'Environment',
};
