import React from 'react';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import ReleaseDetailsView from '../components/Releases/ReleaseDetailsView';
import { ReleaseModel } from '../models';
import { AccessReviewResources } from '../types';

const ReleasesPage = () => {
  const params = useParams();
  const { release, appName } = params;
  const accessReviewResources: AccessReviewResources = [{ model: ReleaseModel, verb: 'get' }];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ReleaseDetailsView applicationName={appName} releaseName={release} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ReleasesPage;
