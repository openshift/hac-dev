import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import EnvironmentListView from '../components/Environment/EnvironmentListView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';

const WorkspaceSettingsPage: React.FC = () => {
  return (
    <NamespacedPage>
      <Helmet>
        <title>Workspace settings page</title>
      </Helmet>
      <PageLayout title="Settings">
        <PageSection variant={PageSectionVariants.light} isFilled>
          <EnvironmentListView />
        </PageSection>
      </PageLayout>
    </NamespacedPage>
  );
};

export default WorkspaceSettingsPage;
