import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Button,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import DeploymentSettingsView from '../components/DeploymentSettingsForm/DeploymentSettingsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ComponentModel } from '../models';
import { HeadTitle } from '../shared/components/HeadTitle';
import { AccessReviewResources } from '../types';
import { useApplicationBreadcrumbs } from '../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

const DeploymentSettingsPage: React.FunctionComponent<React.PropsWithChildren<unknown>> = () => {
  const { workspace } = useWorkspaceInfo();
  const params = useParams();
  const { componentName, appName } = params;
  const navigate = useNavigate();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const accessReviewResources: AccessReviewResources = [{ model: ComponentModel, verb: 'update' }];

  const emptyState = (
    <PageLayout
      breadcrumbs={[
        ...applicationBreadcrumbs,
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${appName}/components`,
          name: 'components',
        },
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${appName}/components/${componentName}`,
          name: componentName,
        },
        {
          path: '#',
          name: 'Edit deployment settings',
        },
      ]}
      title="Edit deployment settings"
      description="View and edit deployment settings. Updates will take effect when the component is redeployed."
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
      <HeadTitle>{`${componentName} - Deployment Settings | ${FULL_APPLICATION_TITLE}`}</HeadTitle>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <DeploymentSettingsView componentName={componentName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default DeploymentSettingsPage;
