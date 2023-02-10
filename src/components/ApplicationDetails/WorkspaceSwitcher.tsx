import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Level, LevelItem } from '@patternfly/react-core';
import WorkspaceContext from '../../utils/workspace-context';
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
    navigate(`/stonesoup/workspaces/${item.name}/applications`);
    setWorkspace(item.name);
  };

  return workspaces.length > 0 ? (
    <ContextSwitcher
      resourceType="workspace"
      menuItems={menuItems}
      selectedItem={{ key: selectedItem.metadata.name, name: selectedItem.metadata.name }}
      onSelect={onSelect}
      footer={
        <Level>
          <LevelItem>
            <Link to="#">View workspaces list</Link>
          </LevelItem>
        </Level>
      }
    />
  ) : null;
};
