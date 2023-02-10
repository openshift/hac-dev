import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWorkspace } from '../utils/workspace-context-utils';

const WorkspacePage: React.FunctionComponent = () => {
  const workspace = useWorkspace();

  return <Navigate to={`/stonesoup/workspaces/${workspace}/applications`} />;
};

export default WorkspacePage;
