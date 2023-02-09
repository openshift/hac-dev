import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Level, LevelItem } from '@patternfly/react-core';
import { useApplications } from '../../hooks/useApplications';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';

export const ApplicationSwitcher: React.FC<{ selectedApplication?: string }> = ({
  selectedApplication,
}) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();

  const [applications] = useApplications(namespace);

  const menuItems = React.useMemo(
    () =>
      applications?.map((app) => ({ key: app.metadata.name, name: app.spec.displayName })) || [],
    [applications],
  );

  const selectedItem = menuItems.find((item) => item.key === selectedApplication);

  const onSelect = (item: ContextMenuItem) => {
    selectedItem.key !== item.key &&
      navigate(`/stonesoup/workspaces/${workspace}/applications/${item.key}`);
  };

  return menuItems.length > 1 ? (
    <ContextSwitcher
      resourceType="application"
      menuItems={menuItems}
      selectedItem={selectedItem}
      onSelect={onSelect}
      footer={
        <Level>
          <LevelItem>
            <Link to={`/stonesoup/workspaces/${workspace}/import`}>Create application</Link>
          </LevelItem>
          <LevelItem>
            <Link to={`/stonesoup/workspaces/${workspace}`}>View applications list</Link>
          </LevelItem>
        </Level>
      }
    />
  ) : null;
};
