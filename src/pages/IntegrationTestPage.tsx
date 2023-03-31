import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import IntegrationTestView from '../components/IntegrationTest/IntegrationTestForm/IntegrationTestView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { IntegrationTestScenarioModel } from '../models';
import { AccessReviewResources } from '../types';

const IntegrationTestPage: React.FunctionComponent = () => {
  const { appName } = useParams();

  const accessReviewResources: AccessReviewResources = [
    { model: IntegrationTestScenarioModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>
        <title>Create integration test</title>
      </Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <IntegrationTestView applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default IntegrationTestPage;
