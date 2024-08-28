import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export interface Workspace extends K8sResourceCommon {
  status: {
    type?: string;
    namespaces: Namespace[];
    owner: string | { email: string };
    role: WorkspaceRole;
    availableRoles?: WorkspaceRole[];
    bindings?: WorkspaceBinding[];
    space?: { name: string };
  };
  spec?: {
    visibility: string;
  };
}

export interface KubeSawWorkspace extends K8sResourceCommon {
  status: {
    type?: string;
    namespaces: Namespace[];
    owner: string;
    role: WorkspaceRole;
    availableRoles?: WorkspaceRole[];
    bindings?: WorkspaceBinding[];
  };
}

export interface KonfluxWorkspace extends K8sResourceCommon {
  status: {
    type?: string;
    owner: { email: string };
    space?: { name: string };
  };
  spec?: {
    visibility: string;
  };
}

export interface Namespace {
  name: string;
  type?: string;
}

export type WorkspaceRole = 'contributor' | 'maintainer' | 'admin';

export interface WorkspaceBinding {
  masterUserRecord: string;
  role: WorkspaceRole;
  availableActions?: ('update' | 'delete')[];
  bindingRequest?: {
    name: string;
    namespace: string;
  };
}
