import React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { OpenDrawerRightIcon } from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import EnvironmentListView from '../components/Environment/EnvironmentListView';
import { HelpTopicLink } from '../components/HelpTopicLink/HelpTopicLink';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import PageLayout from '../components/PageLayout/PageLayout';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { EnvironmentModel } from '../models';
import { AccessReviewResources } from '../types';

const EnvironmentsListPage: React.FC = () => {
  useQuickstartCloseOnUnmount();
  const accessReviewResources: AccessReviewResources = [
    { model: EnvironmentModel, verb: 'patch' },
    { model: EnvironmentModel, verb: 'create' },
  ];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        <Helmet>
          <title>Environments page</title>
        </Helmet>
        <PageLayout
          title="Environments"
          description={
            <>
              Manage your environments and their configurations, or create a new environment.{' '}
              <HelpTopicLink topicId="settings" isInline>
                Learn more <OpenDrawerRightIcon />
              </HelpTopicLink>
            </>
          }
        >
          <PageSection variant={PageSectionVariants.light} isFilled>
            <EnvironmentListView />
          </PageSection>
        </PageLayout>
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default EnvironmentsListPage;
