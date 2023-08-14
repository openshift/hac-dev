import React from 'react';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ApplicationModel } from '../models';
import { HeadTitle } from '../shared/components/HeadTitle';
import { AccessReviewResources } from '../types';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  const accessReviewResources: AccessReviewResources = [
    { model: ApplicationModel, verb: 'list' },
    { model: ApplicationModel, verb: 'watch' },
  ];

  return (
    <NamespacedPage>
      <HeadTitle>Applications | {FULL_APPLICATION_TITLE}</HeadTitle>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ApplicationListView />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ApplicationsPage;
