import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const EnterpriseContractPolicyModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'EnterpriseContractPolicy',
  plural: 'enterprisecontractpolicies',
  namespaced: true,
};

export const EnterpriseContractPolicyGroupVersionKind: K8sGroupVersionKind = {
  group: EnterpriseContractPolicyModel.apiGroup,
  version: EnterpriseContractPolicyModel.apiVersion,
  kind: EnterpriseContractPolicyModel.kind,
};
