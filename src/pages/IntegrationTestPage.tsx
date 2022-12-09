import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import IntegrationTestView from '../components/IntegrationTest/IntegrationTestForm/IntegrationTestView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';

const IntegrationTestPage: React.FunctionComponent = () => {
  const { appName } = useParams();

  return (
    <NamespacedPage>
      <Helmet>
        <title>Create integration test</title>
      </Helmet>
      <IntegrationTestView applicationName={appName} />
    </NamespacedPage>
  );
};

export default IntegrationTestPage;
