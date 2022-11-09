import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../../dynamic-plugin-sdk';

export const EnterpriseContractPolicyGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'EnterpriseContractPolicy',
};

export const IntegrationTestScenarioModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1alpha1',
  kind: 'IntegrationTestScenario',
  plural: 'integrationtestscenarios',
  namespaced: true,
};

export const IntegrationTestScenarioGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'IntegrationTestScenario',
};

export const ReleaseGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'Release',
};

export const ReleasePlanGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'ReleasePlan',
};

export const ReleaseStrategyGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'ReleaseStrategy',
};

export const EnvironmentGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'Environment',
};

export const ApplicationSnapshotEnvironmentBindingGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'ApplicationSnapshotEnvironmentBinding',
};
