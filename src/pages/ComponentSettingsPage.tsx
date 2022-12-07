import React from 'react';
import { Helmet } from 'react-helmet';
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
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { getQueryArgument } from '../shared/utils';

const ComponentSettingsPage: React.FunctionComponent = () => {
  const componentName = getQueryArgument('componentName');
  const navigate = useNavigate();

  const emptyState = (
    <PageLayout
      breadcrumbs={[
        { path: '/stonesoup/applications', name: 'Applications' },
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
      <Helmet>Component Settings Page</Helmet>
      <ComponentSettingsView componentName={componentName} />
    </NamespacedPage>
  );
};

export default ComponentSettingsPage;
