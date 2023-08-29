import React from 'react';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import SnapshotDetailsView from '../components/SnapshotDetails/SnapshotDetailsView';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { SnapshotModel } from '../models';
import { AccessReviewResources } from '../types';
import NotFoundPage from './NotFoundPage';

const SnapshotDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { snapshotName, appName } = params;

  const accessReviewResources: AccessReviewResources = [{ model: SnapshotModel, verb: 'get' }];

  if (!appName || !snapshotName) {
    return <NotFoundPage />;
  }

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <SnapshotDetailsView snapshotName={snapshotName} applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default SnapshotDetailsPage;
