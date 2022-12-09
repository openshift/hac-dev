import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const PipelineRunModel: K8sModelCommon = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  kind: 'PipelineRun',
  plural: 'pipelineruns',
  namespaced: true,
};

export const PipelineRunGroupVersionKind: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'PipelineRun',
};
