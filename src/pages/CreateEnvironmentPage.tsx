import * as React from 'react';
import { Helmet } from 'react-helmet';
import CreateEnvironment from '../components/Environment/create/CreateEnvironment';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { EnvironmentModel } from '../models';
import { AccessReviewResources } from '../types';

const CreateEnvironmentPage: React.FC = () => {
  const accessReviewResources: AccessReviewResources = [
    { model: EnvironmentModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>Create environment</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <CreateEnvironment />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default CreateEnvironmentPage;
