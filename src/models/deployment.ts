import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from './../dynamic-plugin-sdk';

export const DeploymentModel: K8sModelCommon = {
  apiVersion: 'v1',
  apiGroup: 'apps',
  plural: 'deployments',
  namespaced: true,
  propagationPolicy: 'Foreground',
  kind: 'Deployment',
};

export const DeploymentGroupVersionKind: K8sGroupVersionKind = {
  group: DeploymentModel.apiGroup,
  version: DeploymentModel.apiVersion,
  kind: DeploymentModel.kind,
};
