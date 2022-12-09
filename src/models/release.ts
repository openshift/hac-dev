import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const ReleaseModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'Release',
  plural: 'releases',
  namespaced: true,
};

export const ReleaseGroupVersionKind: K8sGroupVersionKind = {
  group: ReleaseModel.apiGroup,
  version: ReleaseModel.apiVersion,
  kind: ReleaseModel.kind,
};
