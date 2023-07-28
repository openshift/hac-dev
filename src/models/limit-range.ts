import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const LimitRangeModel: K8sModelCommon = {
  apiVersion: 'v1',
  plural: 'limitranges',
  namespaced: true,
  kind: 'LimitRange',
};

export const LimitRangeGroupVersionKind: K8sGroupVersionKind = {
  version: LimitRangeModel.apiVersion,
  kind: LimitRangeModel.kind,
};
