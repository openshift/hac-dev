import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import WorkspaceListView from '../components/WorkspaceList/WorkspaceListView';
import { useWorkspaceBreadcrumbs } from '../utils/breadcrumb-utils';

const WorkspaceListPage = () => {
  const breadcrumbs = useWorkspaceBreadcrumbs();
  return (
    <NamespacedPage>
      <Helmet>
        <title>Workspaces</title>
      </Helmet>
      <PageLayout title="Workspaces" breadcrumbs={[...breadcrumbs]}>
        <PageSection variant={PageSectionVariants.light} isFilled>
          <WorkspaceListView />
        </PageSection>
      </PageLayout>
    </NamespacedPage>
  );
};

export default WorkspaceListPage;
