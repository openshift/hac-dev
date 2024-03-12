import * as React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { TriggerReleaseFormPage } from '../components/ReleaseService/ReleasePlan/TriggerRelease/TriggerReleaseFormPage';
import { FULL_APPLICATION_TITLE } from '../consts/labels';
import { ReleaseModel } from '../models';
import { AccessReviewResources } from '../types';

const TriggerReleasePlanPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  const accessReviewResources: AccessReviewResources = [{ model: ReleaseModel, verb: 'create' }];

  return (
    <NamespacedPage>
      <Helmet>Trigger release plan | ${FULL_APPLICATION_TITLE}</Helmet>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <TriggerReleaseFormPage />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default TriggerReleasePlanPage;
