import React from 'react';
import { useParams } from 'react-router-dom';
import IntegrationTestDetailsView from '../components/IntegrationTest/IntegrationTestDetailsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { IntegrationTestScenarioModel } from '../models';
import { AccessReviewResources } from '../types';

const IntegrationTestDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { testName, appName } = params;

  const accessReviewResources: AccessReviewResources = [
    { model: IntegrationTestScenarioModel, verb: 'get' },
  ];

  if (!appName || !testName) {
    return <>Not found</>;
  }

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <IntegrationTestDetailsView testName={testName} applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default IntegrationTestDetailsPage;
