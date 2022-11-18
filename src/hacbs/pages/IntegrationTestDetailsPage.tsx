import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import IntegrationTestDetailsView from '../components/IntegrationTest/IntegrationTestDetailsView';

const IntegrationTestDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { testName, appName } = params;

  if (!appName || !testName) {
    return <>Not found</>;
  }

  return (
    <NamespacedPage>
      <Helmet>
        <title>IntegrationTest Details</title>
      </Helmet>
      <IntegrationTestDetailsView testName={testName} applicationName={appName} />
    </NamespacedPage>
  );
};

export default IntegrationTestDetailsPage;
