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
  workspaceResource: Workspace;
  workspacesLoaded: boolean;
  workspaces: Workspace[];
  lastUsedWorkspace: string;
  /**
   * This is used to trigger a manual re-fetch of the Workspace CR when there
   * are status updates to the space lister API. Needed because we cannot use
   * k8s utils to get/watch the resource since k8s utils add workspace context
   * in url and the workspace API does not like it.
   */
  updateWorkspace: () => void;
};

export const WorkspaceContext = React.createContext<WorkspaceContextData>({
  namespace: '',
  workspace: '',
  workspaceResource: undefined,
  workspaces: [],
  workspacesLoaded: false,
  lastUsedWorkspace: getActiveWorkspace(),
  updateWorkspace: () => {},
});

export const WorkspaceProvider = WorkspaceContext.Provider;
export const useLastUsedWorkspace = () => React.useContext(WorkspaceContext).lastUsedWorkspace;

export const useWorkspaceInfo = () => {
  const { namespace, workspace } = React.useContext(WorkspaceContext);
  return { namespace, workspace };
};

export const getHomeWorkspace = (workspaces: Workspace[]) =>
  workspaces?.find((w) => w?.status?.type === 'home');

const fetchWorkspace = async (name: string): Promise<Workspace> =>
  fetch(
    `/api/k8s/apis/${WorkspaceModel.apiGroup}/${WorkspaceModel.apiVersion}/${WorkspaceModel.plural}/${name}`,
  ).then((data) => data.json());

export const useActiveWorkspace = (): WorkspaceContextData => {
  const lastUsedWorkspace = useLastUsedWorkspace();
  const navigate = useNavigate();
  const [, workspaceFromUrl = ''] = window.location.pathname.match(workspacePathMatcher) || [];
  const [workspaceName, setWorkspaceName] = React.useState<string>(getActiveWorkspace);
  const [workspace, setWorkspace] = React.useState<Workspace>();
  const [namespace, setNamespace] = React.useState<string>('');
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [workspacesLoaded, setWorkspacesLoaded] = React.useState<boolean>(false);
  const [wsUpdateCounter, setWsUpdateCounter] = React.useState(1);

  const getDefaultNsForWorkspace = React.useCallback(
    (allWorkspaces: Workspace[], currentWorkspace: string) => {
      const obj = allWorkspaces?.find((w) => w.metadata.name === currentWorkspace);
      return obj?.status?.namespaces.find((n) => n.type === 'default');
    },
    [],
  );

  React.useEffect(() => {
    if (workspaceName && workspaces?.length > 0) {
      setActiveWorkspace(workspaceName);
      const ns = getDefaultNsForWorkspace(workspaces, workspaceName);
      if (ns) {
        setNamespace(ns.name);
      }
    }
  }, [getDefaultNsForWorkspace, setNamespace, workspaceName, workspaces]);

  // switch workspace if URL segment has changed
  React.useEffect(() => {
    const urlWorkspace = workspaces.find((w) => w.metadata.name === workspaceFromUrl);
    if (workspaceName && workspaceFromUrl && workspaceFromUrl !== workspaceName && urlWorkspace) {
      setWorkspaceName(workspaceFromUrl);
      setWorkspace(urlWorkspace);
    }
  }, [workspaceName, workspaceFromUrl, workspaces]);

  React.useEffect(() => {
    let unmounted = false;
    const fetchWorkspaces = async () => {
      let allWorkspaces: Workspace[] = [];
      try {
        setActiveWorkspace(''); // to fetch root level workspaces
        allWorkspaces = await k8sListResourceItems<Workspace>({
          model: WorkspaceModel,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching workspaces', e);
      }

      let ws: Workspace;
      if (Array.isArray(allWorkspaces)) {
        const findWorkspace = (wsName: string) =>
          allWorkspaces.find((w) => w.metadata.name === wsName);

        ws =
          findWorkspace(workspaceFromUrl) ??
          findWorkspace(lastUsedWorkspace) ??
          getHomeWorkspace(allWorkspaces) ??
          allWorkspaces[0];
      }

      // workspace resource needs to be fetched separately because the
      // workspace api does not populate workspace's status.availableRoles
      // and status.bindings when fetched with k8sList
      try {
        if (ws) {
          ws = await fetchWorkspace(ws.metadata.name);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching workspace ${ws.metadata.name}: `, e);
      }

      if (unmounted) {
        return;
      }

      if (ws) {
        const wsName = ws.metadata.name;
        setWorkspaceName(wsName);
        setWorkspace(ws);
        setWorkspaces(allWorkspaces);
        setWorkspacesLoaded(true);
        const wsBasePath = generatePath('/application-pipeline/workspaces/:ws', { ws: wsName });

        window.location.pathname.includes('/application-pipeline/workspaces') &&
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

  React.useEffect(() => {
    if (wsUpdateCounter) {
      fetchWorkspace(workspaceName)
        .then(setWorkspace)
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`Error fetching workspace ${workspaceName}: `, e);
        });
    }
  }, [workspaceName, wsUpdateCounter]);

  return {
    namespace,
    lastUsedWorkspace,
    workspace: workspaceName,
    workspaceResource: workspace,
    workspaces,
    workspacesLoaded,
    updateWorkspace: () => setWsUpdateCounter((i) => i + 1),
  };
};
