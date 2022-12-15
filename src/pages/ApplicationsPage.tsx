import React from 'react';
import { Helmet } from 'react-helmet';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  return (
    <NamespacedPage>
      <Helmet>
        <title>Application List Page</title>
      </Helmet>
      <ApplicationListView />
    </NamespacedPage>
  );
};

export default ApplicationsPage;
