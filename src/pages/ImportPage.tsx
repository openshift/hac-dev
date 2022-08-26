import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import HacbsImportForm from '../hacbs/components/ImportForm/ImportForm';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../shared/utils';

const ImportPage: React.FunctionComponent = () => {
  const [hacbsFlag] = useFeatureFlag(HACBS_FLAG);
  useQuickstartCloseOnUnmount();

  const applicationName = getQueryArgument('application');

  const title = applicationName ? 'Add component' : 'Create application';

  const Form = hacbsFlag ? HacbsImportForm : ImportForm;

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
        <Form applicationName={applicationName} />
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
