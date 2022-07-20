import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../../components/NamespacedPage/NamespacedPage';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../../shared/utils';
import { PipelineRunDetailsView } from '../components/PipelineRunDetailsView/PipelineRunDetailsView';
import PipelineRunsListView from '../components/PipelineRunListView/PipelineRunsListView';

const PipelineRunPage = () => {
  useQuickstartCloseOnUnmount();
  const name = getQueryArgument('name');

  return (
    <NamespacedPage>
      {name ? (
        <React.Fragment>
          <Helmet>
            <title>Pipelinerun Details Page</title>
          </Helmet>
          <PipelineRunDetailsView pipelineRunName={name} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Helmet>
            <title>Pipelineruns</title>
          </Helmet>
          <PageLayout title="Pipelineruns" description="Pipelineruns are listed here.">
            <PageSection
              padding={{ default: 'noPadding' }}
              variant={PageSectionVariants.light}
              isFilled
            >
              <PipelineRunsListView applicationName={name} />
            </PageSection>
          </PageLayout>
        </React.Fragment>
      )}
    </NamespacedPage>
  );
};

export default PipelineRunPage;
