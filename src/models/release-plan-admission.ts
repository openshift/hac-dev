import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const ReleasePlanAdmissionModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'ReleasePlanAdmission',
  plural: 'releaseplanadmissions',
  namespaced: true,
};

export const ReleasePlanAdmissionGroupVersionKind: K8sGroupVersionKind = {
  group: ReleasePlanAdmissionModel.apiGroup,
  version: ReleasePlanAdmissionModel.apiVersion,
  kind: ReleasePlanAdmissionModel.kind,
};
