import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { setActiveWorkspace } from '@openshift/dynamic-plugin-sdk-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const WorkspacePage: React.FunctionComponent = () => {
  const name = useParams()?.workspaceName;
  const { workspace } = useWorkspaceInfo();
  if (!workspace) {
    setActiveWorkspace(name);
  }

  return <Navigate to={`/stonesoup/workspaces/${workspace}/applications`} replace />;
};

export default WorkspacePage;
