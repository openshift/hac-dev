import * as React from 'react';
import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';

export type WorkspaceContextData = {
  workspace: string;
  workspacesLoaded: boolean;
  workspaces: K8sResourceCommon[];
  setWorkspace: React.Dispatch<React.SetStateAction<string>>;
};

const WorkspaceContext = React.createContext<WorkspaceContextData>({
  workspace: '',
  setWorkspace: () => {},
  workspaces: [],
  workspacesLoaded: false,
});

export default WorkspaceContext;
