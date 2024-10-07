import { KonfluxWorkspace, KubeSawWorkspace } from '../../types';
import { WorkspaceLabels } from '../ContextSwitcher/context-switcher-utils';

export const mockKubesawWorkspaces: KubeSawWorkspace[] = [
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'workspace-one',
      namespace: 'toolchain-host-operator',
    },
    status: {
      type: 'home',
      namespaces: [
        {
          name: 'workspace-one-tenant',
          type: 'default',
        },
        {
          name: 'myworkspace-extra',
        },
      ],
      owner: 'john',
      role: 'admin',
    },
  },
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'workspace-two',
      namespace: 'toolchain-host-operator',
    },
    status: {
      namespaces: [
        {
          name: 'workspace-two-tenant',
          type: 'default',
        },
      ],
      owner: 'doe',
      role: 'admin',
    },
  },
];

export const mockKonfluxWorkspaces: KonfluxWorkspace[] = [
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'default',
      namespace: 'workspace-one',
      labels: { [WorkspaceLabels.IS_OWNER]: 'true', [WorkspaceLabels.HAS_DIRECT_ACCESS]: 'true' },
    },
    status: {
      type: 'home',
      space: { name: 'workspace-one' },
      owner: { email: 'abhi@redhat.com' },
    },
    spec: { visibility: 'private' },
  },
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'default',
      namespace: 'workspace-two',
      labels: { [WorkspaceLabels.IS_OWNER]: 'false', [WorkspaceLabels.HAS_DIRECT_ACCESS]: 'true' },
    },
    status: {
      type: 'home',
      space: { name: 'workspace-two' },
      owner: { email: 'sbudhwar@redhat.com' },
    },
    spec: { visibility: 'private' },
  },
  {
    apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
    kind: 'Workspace',
    metadata: {
      name: 'default',
      namespace: 'workspace-three',
      labels: { [WorkspaceLabels.IS_OWNER]: 'false', [WorkspaceLabels.HAS_DIRECT_ACCESS]: 'false' },
    },
    status: {
      type: 'home',
      space: { name: 'workspace-three' },
      owner: { email: 'nimisha@redhat.com' },
    },
    spec: { visibility: 'community' },
  },
];
