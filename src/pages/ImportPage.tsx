import React from 'react';
import { Helmet } from 'react-helmet';
import { HelpTopicLink } from '../components/HelpTopicLink/HelpTopicLink';
import ImportForm from '../components/ImportForm/ImportForm';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../shared/utils';

const ImportPage: React.FunctionComponent = () => {
  const applicationName = getQueryArgument('application');

  const title = applicationName ? 'Build your application' : 'Create your application';
  const description = (
    <>
      Import your code repo or start with a sample.{' '}
      <HelpTopicLink topicId="create-app">Learn more</HelpTopicLink>
    </>
  );
  useQuickstartCloseOnUnmount();
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
        description={description}
      >
        <ImportForm applicationName={applicationName} />
      </PageLayout>
    </NamespacedPage>
  );
};

export default ImportPage;
