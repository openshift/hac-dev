import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const IntegrationTestScenarioModel: K8sModelCommon = {
  apiGroup: 'appstudio.redhat.com',
  apiVersion: 'v1beta1',
  kind: 'IntegrationTestScenario',
  plural: 'integrationtestscenarios',
  namespaced: true,
};

export const IntegrationTestScenarioGroupVersionKind: K8sGroupVersionKind = {
  group: IntegrationTestScenarioModel.apiGroup,
  version: IntegrationTestScenarioModel.apiVersion,
  kind: IntegrationTestScenarioModel.kind,
};
