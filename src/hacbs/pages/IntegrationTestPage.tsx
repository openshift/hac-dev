import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import IntegrationTestView from '../components/IntegrationTestForm/IntegrationTestView';

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
