import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  getActiveWorkspace,
  k8sListResourceItems,
  setActiveWorkspace,
} from '@openshift/dynamic-plugin-sdk-utils';
import { WorkspaceModel } from '../models/workspace';
import { Workspace } from '../types/workspace';

const workspacePathMatcher = new RegExp(/workspaces\/([^/]+)/);

export type WorkspaceContextData = {
  namespace: string;
  workspace: string;
  workspacesLoaded: boolean;
  workspaces: Workspace[];
  setWorkspace: React.Dispatch<React.SetStateAction<string>>;
  lastUsedWorkspace: string;
};

export const WorkspaceContext = React.createContext<WorkspaceContextData>({
  namespace: '',
  workspace: '',
  setWorkspace: () => {},
  workspaces: [],
  workspacesLoaded: false,
  lastUsedWorkspace: getActiveWorkspace(),
});

export const WorkspaceProvider = WorkspaceContext.Provider;
export const useLastUsedWorkspace = () => React.useContext(WorkspaceContext).lastUsedWorkspace;

export const useWorkspaceInfo = () => {
  const { namespace, workspace } = React.useContext(WorkspaceContext);
  return { namespace, workspace };
};
export const getHomeWorkspace = (workspaces) => workspaces?.find((w) => w?.status?.type === 'home');

export const useActiveWorkspace = (): WorkspaceContextData => {
  const lastUsedWorkspace = useLastUsedWorkspace();
  const navigate = useNavigate();
  const [, workspaceFromUrl = ''] = window.location.pathname.match(workspacePathMatcher) || [];
  const [workspace, setWorkspace] = React.useState<string>(getActiveWorkspace);
  const [namespace, setNamespace] = React.useState<string>('');
  const [workspaces, setWorkspaces] = React.useState<any>([]);
  const [workspacesLoaded, setWorkspacesLoaded] = React.useState<boolean>(false);

  const getDefaultNsForWorkspace = React.useCallback((allWorkspaces, currentWorkspace) => {
    const obj = allWorkspaces?.find((w) => w.metadata.name === currentWorkspace);
    return obj?.status?.namespaces.find((n) => n.type === 'default');
  }, []);

  React.useEffect(() => {
    if (workspace && workspaces?.length > 0) {
      setActiveWorkspace(workspace);
      const ns = getDefaultNsForWorkspace(workspaces, workspace);
      if (ns) {
        setNamespace(ns.name);
      }
    }
  }, [getDefaultNsForWorkspace, setNamespace, workspace, workspaces]);

  React.useEffect(() => {
    let unmounted = false;
    const fetchWorkspaces = async () => {
      let allWorkspaces = [];
      try {
        setActiveWorkspace(''); // to fetch root level workspaces
        allWorkspaces = await k8sListResourceItems({
          model: WorkspaceModel,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching workspaces', e);
      }

      if (unmounted) {
        return;
      }

      let ws: string;
      if (Array.isArray(allWorkspaces)) {
        const workspaceNames = allWorkspaces.map((dataResource) => dataResource.metadata.name);

        const isWorkspaceAvailable = (wsName: string) => workspaceNames.includes(wsName);

        ws = isWorkspaceAvailable(workspaceFromUrl)
          ? workspaceFromUrl
          : isWorkspaceAvailable(lastUsedWorkspace)
          ? lastUsedWorkspace
          : getHomeWorkspace(allWorkspaces)?.metadata?.name ?? workspaceNames[0];
      }

      if (ws) {
        setWorkspace(ws);
        setWorkspaces(allWorkspaces);
        setWorkspacesLoaded(true);
        const wsBasePath = generatePath('/stonesoup/workspaces/:ws', { ws });

        window.location.pathname.includes('/stonesoup/workspaces') &&
          !window.location.pathname.includes(wsBasePath) &&
          navigate(`${wsBasePath}/applications`);
      }
    };

    fetchWorkspaces();
    return () => {
      unmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    namespace,
    lastUsedWorkspace,
    workspace,
    workspaces,
    setWorkspace,
    workspacesLoaded,
  };
};
