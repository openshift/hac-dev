import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Level, LevelItem } from '@patternfly/react-core';
import { useApplications } from '../../hooks/useApplications';
import { ApplicationModel, ComponentModel } from '../../models';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import { ContextMenuItem, ContextSwitcher } from '../ContextSwitcher';
import {
  APPLICATION_SWITCHER_STORAGE_KEY,
  ContextTab,
  MenuTabs,
} from '../ContextSwitcher/ContextSwitcher';

export const ApplicationSwitcher: React.FC<
  React.PropsWithChildren<{ selectedApplication?: string }>
> = ({ selectedApplication }) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const [canCreateApplication] = useAccessReviewForModel(ApplicationModel, 'create');
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  const [applications] = useApplications(namespace);

  const menuItems = React.useMemo(
    () =>
      applications?.map((app) => ({ key: app.metadata.name, name: app.spec.displayName })) || [],
    [applications],
  );

  const selectedItem = menuItems.find((item) => item.key === selectedApplication);

  const onSelect = (item: ContextMenuItem) => {
    selectedItem.key !== item.key &&
      navigate(`/application-pipeline/workspaces/${workspace}/applications/${item.key}`);
  };

  return menuItems.length > 1 ? (
    <ContextSwitcher
      resourceType="application"
      menuItems={[
        {
          tabKey: ContextTab.All,
          tabName: MenuTabs.All.name,
          displayName: MenuTabs.All.displayName,
          menuItems,
        },
      ]}
      selectedItem={selectedItem}
      onSelect={onSelect}
      showRecentItems
      storageKey={APPLICATION_SWITCHER_STORAGE_KEY}
      footer={
        <Level>
          <LevelItem>
            <ButtonWithAccessTooltip
              variant="link"
              component={(props) => (
                <Link {...props} to={`/application-pipeline/workspaces/${workspace}/import`} />
              )}
              isInline
              tooltip="You don't have access to create an application"
              isDisabled={!(canCreateApplication && canCreateComponent)}
              analytics={{
                link_name: 'create-application',
                workspace,
              }}
            >
              Create application
            </ButtonWithAccessTooltip>
          </LevelItem>
          <LevelItem>
            <Button
              variant="link"
              component={(props) => (
                <Link
                  {...props}
                  to={`/application-pipeline/workspaces/${workspace}/applications`}
                />
              )}
              isInline
            >
              View applications list
            </Button>
          </LevelItem>
        </Level>
      }
    />
  ) : null;
};
