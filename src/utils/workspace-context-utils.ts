import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  getActiveWorkspace,
  k8sListResourceItems,
  setActiveWorkspaceLocalStorage as setActiveWorkspace,
} from '@openshift/dynamic-plugin-sdk-utils';
import { ItemVisibility } from '../components/ContextSwitcher/context-switcher-utils';
import { WorkspaceModel } from '../models/workspace';
import { Workspace } from '../types/workspace';

const workspacePathMatcher = new RegExp(/workspaces\/([^/]+)/);
const NAMESPACE_SUFFIX = '-tenant';

export type WorkspaceContextData = {
  namespace: string;
  workspace: string;
  workspaceResource: Workspace;
  workspacesLoaded: boolean;
  kubesawWorkspaces: Workspace[];
  konfluxWorkspaces: Workspace[];
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
  kubesawWorkspaces: [],
  konfluxWorkspaces: [],
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

const fetchKubesawWorkspace = async (name: string): Promise<Workspace> =>
  fetch(
    `/api/k8s/apis/${WorkspaceModel.apiGroup}/${WorkspaceModel.apiVersion}/${WorkspaceModel.plural}/${name}`,
  ).then((data) => data.json());

export const fetchKonfluxWorkspaces = async (): Promise<{ items: Workspace[] }> =>
  fetch(`/api/k8s/workspace/apis/workspaces.konflux-ci.dev/v1alpha1/workspaces`).then((data) =>
    data.json(),
  );

export const useActiveWorkspace = (): WorkspaceContextData => {
  const lastUsedWorkspace = useLastUsedWorkspace();
  const navigate = useNavigate();
  const [, workspaceFromUrl = ''] = window.location.pathname.match(workspacePathMatcher) || [];
  const [workspaceName, setWorkspaceName] = React.useState<string>(getActiveWorkspace);
  const [workspace, setWorkspace] = React.useState<Workspace>();
  const [namespace, setNamespace] = React.useState<string>('');
  const [kubesawWorkspaces, setKubesawWorkspaces] = React.useState<Workspace[]>([]);
  const [konfluxWorkspaces, setKonfluxWorkspaces] = React.useState<Workspace[]>([]);
  const [workspacesLoaded, setWorkspacesLoaded] = React.useState<boolean>(false);
  const [wsUpdateCounter, setWsUpdateCounter] = React.useState(1);

  const getDefaultNsForWorkspace = React.useCallback(
    (kubeWS: Workspace[], currentWorkspace: string, konfluxWS: Workspace[]) => {
      const obj = kubeWS?.find((w) => w.metadata.name === currentWorkspace);
      if (obj) {
        return obj?.status?.namespaces.find((n) => n.type === 'default');
      }
      const ws = konfluxWS?.find((w) => w.metadata?.namespace === currentWorkspace);
      return { name: `${ws.metadata?.namespace}${NAMESPACE_SUFFIX}` };
    },
    [],
  );

  React.useEffect(() => {
    if (workspaceName && kubesawWorkspaces?.length > 0) {
      setActiveWorkspace(workspaceName);
      const ns = getDefaultNsForWorkspace(kubesawWorkspaces, workspaceName, konfluxWorkspaces);
      if (ns) {
        setNamespace(ns.name);
      }
    }
  }, [getDefaultNsForWorkspace, setNamespace, workspaceName, kubesawWorkspaces, konfluxWorkspaces]);

  // switch workspace if URL segment has changed
  React.useEffect(() => {
    const urlWorkspace =
      kubesawWorkspaces?.find((w) => w.metadata.name === workspaceFromUrl) ??
      konfluxWorkspaces?.find((w) => w.metadata?.namespace === workspaceFromUrl);

    if (workspaceName && workspaceFromUrl && workspaceFromUrl !== workspaceName && urlWorkspace) {
      setWorkspaceName(workspaceFromUrl);
      setWorkspace(urlWorkspace);
    }
  }, [workspaceName, workspaceFromUrl, kubesawWorkspaces, konfluxWorkspaces]);

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

      const newWS: { items: Workspace[] } = await fetchKonfluxWorkspaces();

      setKonfluxWorkspaces(newWS.items ?? []);

      // workspace resource needs to be fetched separately because the
      // workspace api does not populate workspace's status.availableRoles
      // and status.bindings when fetched with k8sList
      if (ws && ws.spec?.visibility !== ItemVisibility.COMMUNITY) {
        try {
          if (ws) {
            ws = await fetchKubesawWorkspace(ws.metadata.name);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Error fetching workspace ${ws.metadata.name}: `, e);
        }
      }
      if (unmounted) {
        return;
      }

      if (ws) {
        const wsName = ws.metadata.name;
        setWorkspaceName(wsName);
        setWorkspace(ws);
        setKubesawWorkspaces(allWorkspaces);
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
      fetchKubesawWorkspace(workspaceName)
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
    kubesawWorkspaces,
    konfluxWorkspaces,
    workspacesLoaded,
    updateWorkspace: () => setWsUpdateCounter((i) => i + 1),
  };
};
