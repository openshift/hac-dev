import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { PipelineRunDetailsView } from '../components/PipelineRunDetailsView/PipelineRunDetailsView';
import PipelineRunsListView from '../components/PipelineRunListView/PipelineRunsListView';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { PipelineRunModel } from '../models';
import { AccessReviewResources } from '../types';

const PipelineRunPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const name = params.plrName;
  const accessReviewResources: AccessReviewResources = name
    ? [{ model: PipelineRunModel, verb: 'get' }]
    : [
        { model: PipelineRunModel, verb: 'list' },
        { model: PipelineRunModel, verb: 'watch' },
      ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        {name ? (
          <React.Fragment>
            <PipelineRunDetailsView pipelineRunName={name} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Helmet>
              <title>Pipeline runs</title>
            </Helmet>
            <PageLayout title="Pipeline runs" description="Pipeline runs are listed here.">
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
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default PipelineRunPage;
