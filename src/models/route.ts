import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const RouteModel: K8sModelCommon = {
  apiGroup: 'route.openshift.io',
  apiVersion: 'v1',
  plural: 'routes',
  namespaced: true,
  kind: 'Route',
};

export const RouteGroupVersionKind: K8sGroupVersionKind = {
  group: RouteModel.apiGroup,
  version: RouteModel.apiVersion,
  kind: RouteModel.kind,
};
