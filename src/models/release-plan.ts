import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const ReleasePlanModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ReleasePlan',
  plural: 'releaseplans',
  namespaced: true,
};

export const ReleasePlanGroupVersionKind: K8sGroupVersionKind = {
  group: ReleasePlanModel.apiGroup,
  version: ReleasePlanModel.apiVersion,
  kind: ReleasePlanModel.kind,
};
