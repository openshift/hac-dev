import * as React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import AddSecretForm from '../components/Secrets/SecretsForm/AddSecretForm';
import { RemoteSecretModel } from '../models';
import { AccessReviewResources } from '../types';

const CreateSecretpage: React.FC = () => {
  const accessReviewResources: AccessReviewResources = [
    { model: RemoteSecretModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>Create secret</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <AddSecretForm />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default CreateSecretpage;
