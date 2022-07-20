import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import ApplicationDetailsView from '../components/ApplicationDetailsView/ApplicationDetailsView';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import { GettingStartedModal } from '../components/modal/GettingStartedModal';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import HacbsApplicationDetails from '../hacbs/components/ApplicationDetails/HacbsApplicationDetails';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import imageUrl from '../imgs/getting-started-illustration.svg';
import { getQueryArgument } from '../shared/utils';

const GETTING_STARTED_MODAL_KEY = 'application-list-getting-started-modal';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  const applicationName = getQueryArgument('name');
  const [hacbs] = useFeatureFlag(HACBS_FLAG);

  return (
    <NamespacedPage>
      <GettingStartedModal
        imgClassName="pf-u-justify-content-center pf-u-px-4xl"
        localStorageKey={GETTING_STARTED_MODAL_KEY}
        title="Developing apps just got easier"
        imgSrc={imageUrl}
        imgAlt="Illustration showing users developing applications"
      >
        Build apps quickly, deploy and automate anywhere, and troubleshoot your apps - all in one
        space.
      </GettingStartedModal>
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
        <>
          <Helmet>
            <title>Application List Page</title>
          </Helmet>
          <ApplicationListView />
        </>
      )}
    </NamespacedPage>
  );
};

export default ApplicationsPage;
