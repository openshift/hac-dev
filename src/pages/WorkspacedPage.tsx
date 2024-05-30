import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { setActiveWorkspaceLocalStorage as setActiveWorkspace } from '@openshift/dynamic-plugin-sdk-utils';
import { WorkspaceContext, useWorkspaceInfo } from '../utils/workspace-context-utils';

const WorkspacedPage: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const { pathname } = useLocation();
  const name = useParams()?.workspaceName;
  const mainPath = pathname.split('/').pop();
  const { lastUsedWorkspace } = React.useContext(WorkspaceContext);

  const { workspace } = useWorkspaceInfo();
  if (!workspace) {
    setActiveWorkspace(name);
  }

  const workspacedPath =
    mainPath === 'workspaces'
      ? `${pathname}/${workspace}/applications` // Default path is for applications and starts with workspace context
      : `${pathname}/workspaces/${workspace || lastUsedWorkspace}`;

  return <Navigate to={workspacedPath} replace />;
};

export default WorkspacedPage;
