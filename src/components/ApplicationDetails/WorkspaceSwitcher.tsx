import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button, Flex, FlexItem } from '@patternfly/react-core';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';
import { ItemVisibility } from '../ContextSwitcher/context-switcher-utils';
import { ContextTab, MenuTabs } from '../ContextSwitcher/ContextSwitcher';

export const WORKSPACE_SWITCHER_STORAGE_KEY = 'workspace-switcher';

export const WorkspaceSwitcher: React.FC<
  React.PropsWithChildren<{ selectedWorkspace?: string }>
> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { workspace, konfluxWorkspaces = [] } = React.useContext(WorkspaceContext);

  const menuItems = React.useMemo(
    () =>
      (Array.isArray(konfluxWorkspaces) &&
        konfluxWorkspaces.length > 0 &&
        konfluxWorkspaces.map((ws) => ({
          key: ws.status?.space.name ?? ws.metadata?.namespace,
          name: ws.status?.space.name ?? ws.metadata?.namespace,
          visibility: ws.spec?.visibility,
        }))) ||
      [],
    [konfluxWorkspaces],
  );

  const selectedItem =
    konfluxWorkspaces?.find((item) => item.status?.space?.name === workspace) ||
    (konfluxWorkspaces.length > 0 && konfluxWorkspaces[0]);

  const onSelect = (item: ContextMenuItem) => {
    // switch to new workspace but keep the first segment of the URL
    if (pathname.indexOf('workspaces') === -1) {
      navigate(`/application-pipeline/workspaces/${item.name}/applications`);
    } else {
      navigate(
        pathname.replace(
          /\/workspaces\/[-a-z0-9]+\/?([-a-z0-9]*).*/,
          `/workspaces/${item.name}/$1`,
        ),
      );
    }
  };

  const contextMenuItems = React.useMemo(
    () => [
      {
        tabKey: ContextTab.Private,
        tabName: MenuTabs.Private.name,
        displayName: MenuTabs.Private.displayName,
        menuItems: menuItems.filter((item) => item.visibility === ItemVisibility.PRIVATE),
      },
      {
        tabKey: ContextTab.Public,
        tabName: MenuTabs.Public.name,
        displayName: MenuTabs.Public.displayName,
        menuItems: menuItems.filter((item) => item.visibility === ItemVisibility.COMMUNITY),
      },
      {
        tabKey: ContextTab.All,
        tabName: MenuTabs.All.name,
        displayName: MenuTabs.All.displayName,
        menuItems,
      },
    ],
    [menuItems],
  );

  if (!Array.isArray(konfluxWorkspaces) || konfluxWorkspaces.length === 0) {
    return null;
  }
  const namespace = selectedItem?.metadata?.namespace;
  const footer = (
    <Flex direction={{ default: 'column' }}>
      <FlexItem align={{ default: 'alignRight' }}>
        <Button
          variant="link"
          component={(props) => <Link {...props} to={`/application-pipeline/workspace-list`} />}
          isInline
        >
          View workspace list
        </Button>
      </FlexItem>
    </Flex>
  );

  return (
    <ContextSwitcher
      resourceType="workspace"
      menuItems={contextMenuItems}
      storageKey={WORKSPACE_SWITCHER_STORAGE_KEY}
      selectedItem={{ key: namespace, name: selectedItem?.status?.space.name ?? namespace }}
      onSelect={onSelect}
      footer={footer}
    />
  );
};
