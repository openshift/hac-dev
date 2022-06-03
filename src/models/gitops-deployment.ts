import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const GitOpsDeploymentModal: K8sModelCommon = {
  apiGroup: 'managed-gitops.redhat.com',
  apiVersion: 'v1alpha1',
  plural: 'gitopsdeployments',
  namespaced: true,
  kind: 'GitOpsDeployment',
};

export const GitOpsDeploymentGroupVersionKind: K8sGroupVersionKind = {
  group: GitOpsDeploymentModal.apiGroup,
  version: GitOpsDeploymentModal.apiVersion,
  kind: GitOpsDeploymentModal.kind,
};
