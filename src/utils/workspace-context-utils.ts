import * as React from 'react';
import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import workspaceContext, { WorkspaceContextData } from './workspace-context';
// temporary mock data
// https://docs.google.com/document/d/1aosYWMnUf45McWPLWWfqce_To4amRZA35mYzEPHq51w/edit
// https://redhat-internal.slack.com/archives/C02EQERSV3N/p1675373086126109
export const WS_DATA = {
  apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
  kind: 'WorkspaceList',
  metadata: {
    resourceVersion: '',
  },
  items: [
    {
      apiVersion: 'toolchain.dev.openshift.com/v1alpha1',
      kind: 'Workspace',
      metadata: {
        name: 'workspace-one',
        namespace: 'toolchain-host-operator',
      },
      status: {
        namespaces: [
          {
            name: 'myworkspace-tenant',
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
            name: 'myworkspace-tenant',
          },
          {
            name: 'myworkspace-extra',
          },
        ],
        owner: 'john',
        role: 'admin',
      },
    },
  ],
};

export const WorkspaceProvider = workspaceContext.Provider;

export const useWorkspace = () => React.useContext(workspaceContext).workspace;

export const useActiveWorkspace = (): WorkspaceContextData => {
  const [activeWorkspace, setActiveWorkspace] = React.useState<string>('');
  const [workspaces, setWorkspaces] = React.useState<K8sResourceCommon[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    let unmounted = false;
    const fetchWorkspaces = () => {
      const allWorkspaces: K8sResourceCommon[] = WS_DATA.items;
      const workspaceNames = allWorkspaces.map((dataResource) => dataResource.metadata.name);
      const ws = workspaceNames[0];

      if (unmounted) {
        return;
      }
      ws ? setActiveWorkspace(ws) : setActiveWorkspace('karthik-jk');
      setWorkspaces(allWorkspaces);
      setLoaded(true);
    };

    fetchWorkspaces();
    return () => {
      unmounted = true;
    };
  }, []);

  return {
    workspace: activeWorkspace,
    setWorkspace: setActiveWorkspace,
    workspacesLoaded: loaded,
    workspaces,
  };
};
