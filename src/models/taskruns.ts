import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sGroupVersionKind } from '../dynamic-plugin-sdk';

export const TaskRunModel: K8sModelCommon = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  kind: 'TaskRun',
  plural: 'taskruns',
  namespaced: true,
};

export const TaskRunGroupVersionKind: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'TaskRun',
};
