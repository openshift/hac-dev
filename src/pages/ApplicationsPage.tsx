import React from 'react';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import { HeadTitle } from '../components/HeadTitle';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ApplicationModel } from '../models';
import { AccessReviewResources } from '../types';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  const accessReviewResources: AccessReviewResources = [
    { model: ApplicationModel, verb: 'list' },
    { model: ApplicationModel, verb: 'watch' },
  ];

  return (
    <NamespacedPage>
      <HeadTitle>Applications | CI/CD</HeadTitle>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ApplicationListView />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ApplicationsPage;
