import * as React from 'react';
import { Helmet } from 'react-helmet';
import CreateEnvironment from '../components/Environment/create/CreateEnvironment';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';

const CreateEnvironmentPage: React.FC = () => {
  return (
    <NamespacedPage>
      <Helmet>Create Environment</Helmet>
      <CreateEnvironment />
    </NamespacedPage>
  );
};

export default CreateEnvironmentPage;
