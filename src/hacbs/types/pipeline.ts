import { K8sModelCommon, K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../../dynamic-plugin-sdk';

export type PipelineKind = K8sModelCommon & {
  apiGroup: 'appstudio.redhat.com';
  apiVersion: 'v1alpha1';
  kind: 'Pipleline';
  plural: 'pipelines';
  namespaced: true;
};

export type PipelineRunKind = K8sModelCommon &
  K8sResourceCommon & {
    apiGroup: 'tekton.dev';
    version: 'v1alpha1';
    kind: 'PipelineRun';
    plural: 'pipeline runs';
    namespaced: true;
  };

export const PipelineGroupVersionKind: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'Pipeline',
};
