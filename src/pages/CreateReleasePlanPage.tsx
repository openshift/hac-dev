import * as React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { ReleasePlanFormPage } from '../components/ReleaseService/ReleasePlan/ReleasePlanForm/ReleasePlanFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ReleasePlanModel } from '../models';
import { AccessReviewResources } from '../types';

const CreateReleasePlanPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const accessReviewResources: AccessReviewResources = [
    { model: ReleasePlanModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <Helmet>Create release plan | ${FULL_APPLICATION_TITLE}</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ReleasePlanFormPage />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default CreateReleasePlanPage;
