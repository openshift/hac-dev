import React from 'react';
import { Helmet } from 'react-helmet';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../../shared/utils';
import ImportForm from '../components/ImportForm/ImportForm';

const ImportPage: React.FunctionComponent = () => {
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');

  const title = applicationName ? 'Add component' : 'Create application';

  return (
    <NamespacedPage>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageLayout
        breadcrumbs={[
          { path: '/app-studio/applications', name: 'Applications' },
          { path: '#', name: 'Import' },
        ]}
        title={title}
      >
        <ImportForm applicationName={applicationName} />
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
