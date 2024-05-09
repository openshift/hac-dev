import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const ConfigMapModel: K8sModelCommon = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  plural: 'configmaps',
  namespaced: true,
};

export const ConfigMapGroupVersionKind: K8sGroupVersionKind = {
  version: ConfigMapModel.apiVersion,
  kind: ConfigMapModel.kind,
};
