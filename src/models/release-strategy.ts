import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const ReleaseStrategyModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ReleaseStrategy',
  plural: 'releasestrategies',
  namespaced: true,
};

export const ReleaseStrategyGroupVersionKind: K8sGroupVersionKind = {
  group: ReleaseStrategyModel.apiGroup,
  version: ReleaseStrategyModel.apiVersion,
  kind: ReleaseStrategyModel.kind,
};
