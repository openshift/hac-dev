import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import EnvironmentListView from '../components/Environment/EnvironmentListView';
import EnvironmentsInfoAlert from '../components/Environment/EnvironmentsInfoAlert';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { EnvironmentModel } from '../models';
import { AccessReviewResources } from '../types';

const EnvironmentsListPage: React.FC = () => {
  const accessReviewResources: AccessReviewResources = [{ model: EnvironmentModel, verb: 'list' }];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <Helmet>
          <title>Environments | {FULL_APPLICATION_TITLE}</title>
        </Helmet>
        <PageLayout
          title="Environments"
          description="Manage your environments and their configurations, or create a new environment."
        >
          <PageSection variant={PageSectionVariants.light} isFilled>
            <EnvironmentsInfoAlert />
            <EnvironmentListView />
          </PageSection>
        </PageLayout>
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default EnvironmentsListPage;
