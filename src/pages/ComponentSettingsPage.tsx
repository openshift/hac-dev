import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  Button,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import ComponentSettingsView from '../components/ComponentSettingsForm/ComponentSettingsView';
import { HeadTitle } from '../components/HeadTitle';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { getQueryArgument } from '../shared/utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const ComponentSettingsPage: React.FunctionComponent = () => {
  const componentName = getQueryArgument('componentName');
  const navigate = useNavigate();
  const { workspace } = useWorkspaceInfo();

  const emptyState = (
    <PageLayout
      breadcrumbs={[
        { path: `/stonesoup/workspaces/${workspace}/applications`, name: 'Applications' },
        { path: '#', name: 'Component settings' },
      ]}
      title="Component settings"
      description="View and edit component settings. Updates will take effect when the component is redeployed."
    >
      <EmptyState variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No component specified
        </Title>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </EmptyState>
    </PageLayout>
  );

  if (!componentName) {
    return emptyState;
  }

  return (
    <NamespacedPage>
      <HeadTitle>{componentName} - Component Settings | CI/CD</HeadTitle>
      <ComponentSettingsView componentName={componentName} />
    </NamespacedPage>
  );
};

export default ComponentSettingsPage;
