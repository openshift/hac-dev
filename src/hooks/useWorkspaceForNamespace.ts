import * as React from 'react';
import { WorkspaceContext } from '../utils/workspace-context-utils';

export const useWorkspaceForNamespace = (namespace?: string) => {
  const { workspaces } = React.useContext(WorkspaceContext);

  return React.useMemo(() => {
    if (!namespace) {
      return undefined;
    }

    return workspaces.find((w) => w.status?.namespaces?.some((ns) => ns.name === namespace));
  }, [namespace, workspaces]);
};
