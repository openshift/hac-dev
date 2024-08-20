import * as React from 'react';
import { Workspace } from '../types';
import { WorkspaceContext } from '../utils/workspace-context-utils';

export const useWorkspaceForNamespace = (namespace?: string): Workspace => {
  const { kubesawWorkspaces } = React.useContext(WorkspaceContext);

  return React.useMemo(() => {
    if (!namespace) {
      return undefined;
    }

    return kubesawWorkspaces?.find((w) =>
      w.status?.namespaces?.some((ns) => ns.name === namespace),
    );
  }, [namespace, kubesawWorkspaces]);
};
