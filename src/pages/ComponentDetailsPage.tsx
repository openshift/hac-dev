import React from 'react';
import { useParams } from 'react-router-dom';
import ComponentDetailsView from '../components/Components/ComponentDetails/ComponentDetailsView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ComponentModel } from '../models';
import { AccessReviewResources } from '../types';
import NotFoundPage from './NotFoundPage';

const ComponentDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const { componentName, appName } = params;

  const accessReviewResources: AccessReviewResources = [{ model: ComponentModel, verb: 'get' }];

  if (!appName || !componentName) {
    return <NotFoundPage />;
  }

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <ComponentDetailsView componentName={componentName} applicationName={appName} />
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default ComponentDetailsPage;
