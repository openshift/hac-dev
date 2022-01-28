import { K8sGroupVersionKind, K8sModel } from './../dynamic-plugin-sdk';

export const ComponentModel: K8sModel = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'Component',
  plural: 'components',
  abbr: 'COMP',
  label: 'Component',
  labelPlural: 'Components',
  namespaced: true,
};

export const ComponentGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'Component',
};

export const ComponentDetectionQueryModel = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ComponentDetectionQuery',
  abbr: 'CDQ',
  plural: 'componentdetectionqueries',
  label: 'Component Detection Query',
  labelPlural: 'Component Detection Queries',
  namespaced: true,
};
