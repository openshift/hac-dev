import * as React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import AddSecretForm from '../components/Secrets/SecretsForm/AddSecretForm';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { RemoteSecretModel } from '../models';
import { AccessReviewResources } from '../types';

const CreateSecretpage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const accessReviewResources: AccessReviewResources = [
    { model: RemoteSecretModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>Add secret | ${FULL_APPLICATION_TITLE}</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <AddSecretForm />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default CreateSecretpage;
