import * as React from 'react';
import { useWorkspaceForNamespace } from './useWorkspaceForNamespace';

/**
 * @param namespacedObj string with the format `<namespace>/<resource>`
 * @returns resource name and workspace if accessible
 */
export const useWorkspaceResource = (
  namespacedObj?: string,
): [resource?: string, workspace?: string] => {
  const [namespace, resource] = React.useMemo(() => {
    if (!namespacedObj) {
      return [undefined, undefined];
    }
    return namespacedObj.split('/');
  }, [namespacedObj]);

  const workspace = useWorkspaceForNamespace(namespace);

  return [resource, workspace?.metadata.name];
};
