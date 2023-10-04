import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';

export const WorkspaceSwitcher: React.FC<{ selectedWorkspace?: string }> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { workspace, workspaces } = React.useContext(WorkspaceContext);

  const menuItems = React.useMemo(
    () => workspaces?.map((app) => ({ key: app.metadata.name, name: app.metadata.name })) || [],
    [workspaces],
  );
  const selectedItem = workspaces.find((item) => item.metadata.name === workspace) || workspaces[0];

  const onSelect = (item: ContextMenuItem) => {
    // switch to new workspace but keep the first segment of the URL
    navigate(
      pathname.replace(/\/workspaces\/[-a-z0-9]+\/?([-a-z0-9]*).*/, `/workspaces/${item.name}/$1`),
    );
  };

  return workspaces.length > 0 ? (
    <ContextSwitcher
      resourceType="workspace"
      menuItems={menuItems}
      selectedItem={{ key: selectedItem.metadata.name, name: selectedItem.metadata.name }}
      onSelect={onSelect}
      footer={<></>}
    />
  ) : null;
};
