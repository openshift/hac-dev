import React from 'react';
import { useParams } from 'react-router-dom';
import CommitDetailsView from '../components/Commits/CommitDetails/CommitDetailsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { PipelineRunModel } from '../models';
import { AccessReviewResources } from '../types';
import NotFoundPage from './NotFoundPage';

const CommitsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { commitName, appName } = params;
  const accessReviewResources: AccessReviewResources = [{ model: PipelineRunModel, verb: 'get' }];

  if (!appName || !commitName) {
    return <NotFoundPage />;
  }

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <CommitDetailsView commitName={commitName} applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default CommitsPage;
