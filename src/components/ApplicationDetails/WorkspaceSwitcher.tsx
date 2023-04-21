import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';

export const WorkspaceSwitcher: React.FC<{ selectedWorkspace?: string }> = () => {
  const navigate = useNavigate();
  const { workspace, setWorkspace, workspaces } = React.useContext(WorkspaceContext);

  const menuItems = React.useMemo(
    () => workspaces?.map((app) => ({ key: app.metadata.name, name: app.metadata.name })) || [],
    [workspaces],
  );
  const selectedItem = workspaces.find((item) => item.metadata.name === workspace) || workspaces[0];

  const onSelect = (item: ContextMenuItem) => {
    navigate(`/application-pipeline/workspaces/${item.name}/applications`);
    setWorkspace(item.name);
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
