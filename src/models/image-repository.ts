import { K8sGroupVersionKind, K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';

export const ImageRepositoryModel: K8sModelCommon = {
  kind: 'ImageRepository',
  apiVersion: 'v1alpha1',
  apiGroup: 'appstudio.redhat.com',
  plural: 'imagerepositories',
  namespaced: true,
};

export const ImageRepositoryGroupVersionKind: K8sGroupVersionKind = {
  kind: ImageRepositoryModel.kind,
  group: ImageRepositoryModel.apiGroup,
  version: ImageRepositoryModel.apiVersion,
};
