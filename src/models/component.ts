import { K8sModel } from './../dynamic-plugin-sdk';

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
