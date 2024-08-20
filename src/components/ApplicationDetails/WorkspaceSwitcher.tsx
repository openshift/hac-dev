import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';

export const WorkspaceSwitcher: React.FC<
  React.PropsWithChildren<{ selectedWorkspace?: string }>
> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    workspace,
    kubesawWorkspaces = [],
    konfluxWorkspaces = [],
  } = React.useContext(WorkspaceContext);

  const menuItems = React.useMemo(
    () =>
      (Array.isArray(konfluxWorkspaces) &&
        konfluxWorkspaces.length > 0 &&
        konfluxWorkspaces.map((app) => ({
          key: app.metadata.namespace,
          name: app.metadata.namespace,
          visibility: app.spec?.visibility,
        }))) ||
      [],
    [konfluxWorkspaces],
  );
  const selectedItem =
    konfluxWorkspaces?.find((item) => item.metadata.namespace === workspace) ||
    (Array.isArray(kubesawWorkspaces) && kubesawWorkspaces.length > 0 && kubesawWorkspaces[0]);

  const onSelect = (item: ContextMenuItem) => {
    // switch to new workspace but keep the first segment of the URL
    navigate(
      pathname.replace(/\/workspaces\/[-a-z0-9]+\/?([-a-z0-9]*).*/, `/workspaces/${item.name}/$1`),
    );
  };

  return Array.isArray(konfluxWorkspaces) && konfluxWorkspaces.length > 0 ? (
    <ContextSwitcher
      resourceType="workspace"
      menuItems={menuItems}
      selectedItem={{ key: selectedItem.metadata.namespace, name: selectedItem.metadata.namespace }}
      onSelect={onSelect}
      footer={<></>}
    />
  ) : null;
};
