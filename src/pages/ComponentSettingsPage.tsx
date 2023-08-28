import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Button,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import ComponentSettingsView from '../components/ComponentSettingsForm/ComponentSettingsView';
import { HeadTitle } from '../components/HeadTitle';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ComponentModel } from '../models';
import { getQueryArgument } from '../shared/utils';
import { AccessReviewResources } from '../types';
import { useApplicationBreadcrumbs } from '../utils/breadcrumb-utils';

const ComponentSettingsPage: React.FunctionComponent = () => {
  const componentName = getQueryArgument('componentName');
  const navigate = useNavigate();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const accessReviewResources: AccessReviewResources = [{ model: ComponentModel, verb: 'update' }];

  const emptyState = (
    <PageLayout
      breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Component settings' }]}
      title="Component settings"
      description="View and edit component settings. Updates will take effect when the component is redeployed."
    >
      <EmptyState variant={EmptyStateVariant.lg}>
        <EmptyStateHeader
          titleText="No component specified"
          icon={<EmptyStateIcon icon={CubesIcon} />}
          headingLevel="h4"
        />
        <EmptyStateFooter>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </EmptyStateFooter>
      </EmptyState>
    </PageLayout>
  );

  if (!componentName) {
    return emptyState;
  }

  return (
    <NamespacedPage>
      <HeadTitle>{`${componentName} - Component Settings | ${FULL_APPLICATION_TITLE}`}</HeadTitle>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ComponentSettingsView componentName={componentName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ComponentSettingsPage;
