import React from 'react';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import { HeadTitle } from '../components/HeadTitle';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  return (
    <NamespacedPage>
      <HeadTitle>Applications | Stonesoup</HeadTitle>
      <ApplicationListView />
    </NamespacedPage>
  );
};

export default ApplicationsPage;
