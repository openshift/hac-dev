import React from 'react';
import { useParams } from 'react-router-dom';
import IntegrationTestDetailsView from '../components/IntegrationTest/IntegrationTestDetailsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const IntegrationTestDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { testName, appName } = params;

  if (!appName || !testName) {
    return <>Not found</>;
  }

  return (
    <NamespacedPage>
      <IntegrationTestDetailsView testName={testName} applicationName={appName} />
    </NamespacedPage>
  );
};

export default IntegrationTestDetailsPage;
