import React from 'react';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../shared/utils';
import { useApplicationBreadcrumbs } from '../utils/breadcrumb-utils';

const ImportPage: React.FunctionComponent = () => {
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');
  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);

  const title = applicationName ? 'Add component' : 'Create application';

  return (
    <NamespacedPage>
      <PageLayout
        breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Import' }]}
        title={title}
      >
        <ImportForm applicationName={applicationName} />
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
