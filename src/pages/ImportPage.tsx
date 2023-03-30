import React from 'react';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { ApplicationModel, ComponentModel } from '../models';
import { getQueryArgument } from '../shared/utils';
import { AccessReviewResources } from '../types';
import { useApplicationBreadcrumbs } from '../utils/breadcrumb-utils';

const ImportPage: React.FunctionComponent = () => {
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');
  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);

  const title = applicationName ? 'Add component' : 'Create application';
  const accessReviewResources: AccessReviewResources = applicationName
    ? [{ model: ComponentModel, verb: 'create' }]
    : [
        { model: ApplicationModel, verb: 'create' },
        { model: ComponentModel, verb: 'create' },
      ];

  return (
    <NamespacedPage>
      <PageLayout
        breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Import' }]}
        title={title}
      >
        <PageAccessCheck accessReviewResources={accessReviewResources}>
          <ImportForm applicationName={applicationName} />
        </PageAccessCheck>
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
