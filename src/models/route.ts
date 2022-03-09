import { K8sModel, K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const RouteModel: K8sModel = {
  label: 'Route',
  labelPlural: 'Routes',
  apiGroup: 'route.openshift.io',
  apiVersion: 'v1',
  plural: 'routes',
  abbr: 'RT',
  namespaced: true,
  kind: 'Route',
  id: 'route',
};

export const RouteGroupVersionKind: K8sGroupVersionKind = {
  group: RouteModel.apiGroup,
  version: RouteModel.apiVersion,
  kind: RouteModel.kind,
};
