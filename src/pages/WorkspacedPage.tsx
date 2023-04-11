import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { setActiveWorkspace } from '@openshift/dynamic-plugin-sdk-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const WorkspacedPage: React.FunctionComponent = () => {
  const { pathname } = useLocation();
  const name = useParams()?.workspaceName;
  const mainPath = pathname.split('/').pop();

  const { workspace } = useWorkspaceInfo();
  if (!workspace) {
    setActiveWorkspace(name);
  }

  const workspacedPath =
    mainPath === 'workspaces'
      ? `${pathname}/${workspace}/applications` // Default path is for applications and starts with workspace context
      : `${pathname}/workspaces/${workspace}`;

  return <Navigate to={workspacedPath} replace />;
};

export default WorkspacedPage;
