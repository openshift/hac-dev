import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const SelfSubjectAccessReviewModel: K8sModelCommon = {
  apiGroup: 'authorization.k8s.io',
  apiVersion: 'v1',
  kind: 'SelfSubjectAccessReview',
  plural: 'selfsubjectaccessreviews',
};

export const SelfSubjectAccessReviewGroupVersionKind: K8sGroupVersionKind = {
  group: 'authorization.k8s.io',
  version: 'v1',
  kind: 'SelfSubjectAccessReview',
};
