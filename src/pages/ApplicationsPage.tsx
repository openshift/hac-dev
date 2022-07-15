import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import ApplicationDetailsView from '../components/ApplicationDetailsView/ApplicationDetailsView';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import HacbsApplicationDetails from '../hacbs/components/ApplicationDetails/HacbsApplicationDetails';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { getQueryArgument } from '../shared/utils';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  const applicationName = getQueryArgument('name');
  const [hacbs] = useFeatureFlag(HACBS_FLAG);

  return (
    <NamespacedPage>
      {applicationName ? (
        <React.Fragment>
          <Helmet>
            <title>Application Details Page</title>
          </Helmet>
          {hacbs ? (
            <HacbsApplicationDetails applicationName={applicationName} />
          ) : (
            <ApplicationDetailsView applicationName={applicationName} />
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Helmet>
            <title>Application List Page</title>
          </Helmet>
          <PageLayout
            title="Applications"
            description="Applications are a set of components that run together on environments."
          >
            <PageSection
              padding={{ default: 'noPadding' }}
              variant={PageSectionVariants.light}
              isFilled
            >
              <ApplicationListView />
            </PageSection>
          </PageLayout>
        </React.Fragment>
      )}
    </NamespacedPage>
  );
};

export default ApplicationsPage;
