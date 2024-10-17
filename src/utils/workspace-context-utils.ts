import * as React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  getActiveWorkspace,
  k8sListResourceItems,
  setActiveWorkspaceLocalStorage as setActiveWorkspace,
} from '@openshift/dynamic-plugin-sdk-utils';
import { ItemVisibility } from '../components/ContextSwitcher/context-switcher-utils';
import { KubesawWorkspaceModel, KonfluxWorkspaceModel } from '../models/workspace';
import { KonfluxWorkspace, KubeSawWorkspace } from '../types/workspace';

const workspacePathMatcher = new RegExp(/workspaces\/([^/]+)/);

export type WorkspaceContextData = {
  namespace: string;
  workspace: string;
  workspaceResource: KubeSawWorkspace;
  workspacesLoaded: boolean;
  kubesawWorkspaces: KubeSawWorkspace[];
  konfluxWorkspaces: KonfluxWorkspace[];
  lastUsedWorkspace: string;
  /**
   * This is used to trigger a manual re-fetch of the Workspace CR when there
   * are status updates to the space lister API. Needed because we cannot use
   * k8s utils to get/watch the resource since k8s utils add workspace context
   * in url and the workspace API does not like it.
   */
  updateWorkspace: () => void;
  updateVisibility?: (workspace: KonfluxWorkspace, visibility: ItemVisibility) => void;
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
  updateVisibility: () => {},
});

export const WorkspaceProvider = WorkspaceContext.Provider;
export const useLastUsedWorkspace = () => React.useContext(WorkspaceContext).lastUsedWorkspace;

export const useWorkspaceInfo = () => {
  const { namespace, workspace } = React.useContext(WorkspaceContext);
  return { namespace, workspace };
};

export const getHomeWorkspace = (workspaces: KubeSawWorkspace[]) =>
  workspaces?.find((w) => w?.status?.type === 'home');

const fetchKubesawWorkspace = async (name: string): Promise<KubeSawWorkspace> =>
  fetch(
    `/api/k8s/apis/${KubesawWorkspaceModel.apiGroup}/${KubesawWorkspaceModel.apiVersion}/${KubesawWorkspaceModel.plural}/${name}`,
  ).then((data) => data.json());

export const fetchKonfluxWorkspaces = async (): Promise<{ items: KonfluxWorkspace[] }> =>
  fetch(
    `/api/k8s/apis/${KonfluxWorkspaceModel.apiGroup}/${KonfluxWorkspaceModel.apiVersion}/workspaces`,
  ).then((data) => data.json());

export const queryKonfluxWorkspace = async (
  {
    wsName,
    wsNamespace,
    method,
    payload,
  }: { wsName: string; wsNamespace: string; method?: string; payload?: string },
  callback: (data: Response) => KonfluxWorkspace,
): Promise<KonfluxWorkspace> =>
  fetch(
    `/api/k8s/apis/${KonfluxWorkspaceModel.apiGroup}/${KonfluxWorkspaceModel.apiVersion}/namespaces/${wsNamespace}/workspaces/${wsName}`,
    { method: method ?? 'get', body: payload ?? null },
  ).then(callback);

export const useActiveWorkspace = (): WorkspaceContextData => {
  const lastUsedWorkspace = useLastUsedWorkspace();
  const navigate = useNavigate();
  const [, workspaceFromUrl = ''] = window.location.pathname.match(workspacePathMatcher) || [];
  const [workspaceName, setWorkspaceName] = React.useState<string>(getActiveWorkspace);
  const [workspace, setWorkspace] = React.useState<KubeSawWorkspace>();
  const [namespace, setNamespace] = React.useState<string>('');
  const [kubesawWorkspaces, setKubesawWorkspaces] = React.useState<KubeSawWorkspace[]>([]);
  const [konfluxWorkspaces, setKonfluxWorkspaces] = React.useState<KonfluxWorkspace[]>([]);
  const [workspacesLoaded, setWorkspacesLoaded] = React.useState<boolean>(false);
  const [wsUpdateCounter, setWsUpdateCounter] = React.useState(1);
  const [changeVisibilityCounter, setChangeVisibilityCounter] = React.useState(1);

  const getDefaultNsForWorkspace = React.useCallback((obj: KubeSawWorkspace) => {
    if (obj) {
      return obj?.status?.namespaces?.find((n) => n.type === 'default');
    }
  }, []);

  const updateWorkspaceVisibility = React.useCallback(
    async (ws: KonfluxWorkspace, visibility: ItemVisibility): Promise<KonfluxWorkspace> => {
      const newWS = {
        ...ws,
        spec: { ...ws.spec, visibility },
      };

      const callBack = (data) => {
        setChangeVisibilityCounter((i) => i + 1);
        return data.json();
      };

      return queryKonfluxWorkspace(
        {
          wsName: ws.metadata?.name,
          wsNamespace: ws.metadata?.namespace,
          method: 'put',
          payload: JSON.stringify(newWS),
        },
        callBack,
      );
    },
    [],
  );

  React.useEffect(() => {
    if (workspaceName && workspace) {
      setActiveWorkspace(workspaceName);
      const ns = getDefaultNsForWorkspace(workspace);
      if (ns) {
        setNamespace(ns.name);
      }
    }
  }, [getDefaultNsForWorkspace, setNamespace, workspaceName, workspace]);

  // switch workspace if URL segment has changed
  React.useEffect(() => {
    const setUrlWorkspace = async () => {
      if (workspaceFromUrl && workspaceName && workspaceFromUrl !== workspaceName) {
        let urlWorkspace = null;
        try {
          urlWorkspace = await fetchKubesawWorkspace(workspaceFromUrl);
          if (urlWorkspace) {
            setWorkspaceName(urlWorkspace?.metadata.name);
            setWorkspace(urlWorkspace);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Error fetching workspace ${workspaceFromUrl}: `, e);
        }
      }
    };
    setUrlWorkspace();
  }, [workspaceName, workspaceFromUrl, kubesawWorkspaces, konfluxWorkspaces]);

  React.useEffect(() => {
    let unmounted = false;
    const fetchWorkspaces = async () => {
      let kubesawWSList: KubeSawWorkspace[] = [];
      try {
        setActiveWorkspace(''); // to fetch root level workspaces
        kubesawWSList = await k8sListResourceItems<KubeSawWorkspace>({
          model: KubesawWorkspaceModel,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching workspaces', e);
      }

      let ws: KubeSawWorkspace;
      if (Array.isArray(kubesawWSList)) {
        const findWorkspace = (wsName: string) =>
          kubesawWSList.find((w) => w.metadata.name === wsName);

        ws =
          findWorkspace(workspaceFromUrl) ??
          findWorkspace(lastUsedWorkspace) ??
          getHomeWorkspace(kubesawWSList) ??
          kubesawWSList[0];
      }
      let konfluxWSList: { items: KonfluxWorkspace[] } = { items: [] };
      try {
        konfluxWSList = await fetchKonfluxWorkspaces();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching workspace `, e);
      }
      setKonfluxWorkspaces(konfluxWSList.items ?? []);

      // workspace resource needs to be fetched separately because the
      // workspace api does not populate workspace's status.availableRoles
      // and status.bindings when fetched with k8sList

      try {
        if (ws) {
          ws = await fetchKubesawWorkspace(ws.metadata.name);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching workspace ${ws.metadata.name}: `, e);
      }

      if (unmounted) {
        return;
      }

      if (ws) {
        const wsName = ws?.metadata?.name;
        setWorkspaceName(wsName);
        setWorkspace(ws);
        setKubesawWorkspaces(kubesawWSList);
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

  React.useEffect(() => {
    if (changeVisibilityCounter) {
      const reFetchWorkspaces = async () => {
        let konfluxWSList: { items: KonfluxWorkspace[] } = { items: [] };
        try {
          konfluxWSList = await fetchKonfluxWorkspaces();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`Error fetching workspace `, e);
        }
        setKonfluxWorkspaces(konfluxWSList.items ?? []);
      };
      reFetchWorkspaces();
    }
  }, [changeVisibilityCounter]);

  return {
    namespace,
    lastUsedWorkspace,
    workspace: workspaceName,
    workspaceResource: workspace,
    kubesawWorkspaces,
    konfluxWorkspaces,
    workspacesLoaded,
    updateWorkspace: () => setWsUpdateCounter((i) => i + 1),
    updateVisibility: updateWorkspaceVisibility,
  };
};
