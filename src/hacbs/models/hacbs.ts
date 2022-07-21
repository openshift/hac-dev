import { K8sGroupVersionKind } from '../../dynamic-plugin-sdk';

export const EnterpriseContractPolicyGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'EnterpriseContractPolicy',
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

export const ReleaseLinkGroupVersionKind: K8sGroupVersionKind = {
  group: 'appstudio.redhat.com',
  version: 'v1alpha1',
  kind: 'ReleaseLink',
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
