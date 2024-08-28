import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';

export const KubesawWorkspaceModel: K8sModelCommon = {
  apiVersion: 'v1alpha1',
  apiGroup: 'toolchain.dev.openshift.com',
  kind: 'Workspace',
  plural: 'workspaces',
};

export const KonfluxWorkspaceModel: K8sModelCommon = {
  apiVersion: 'v1alpha1',
  apiGroup: 'workspaces.konflux-ci.dev',
  kind: 'Workspace',
  plural: 'workspaces',
};
