import React from 'react';
import { Helmet } from 'react-helmet';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import ApplicationListView from '../components/ApplicationListView/ApplicationListView';
import { GettingStartedModal } from '../components/modal/GettingStartedModal';
import { GettingStartedModal as HacBSGettingStartedModal } from '../components/Modals/GettingStartedModal';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { HACBS_FLAG } from '../hacbs/hacbsFeatureFlag';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import imageUrl from '../imgs/getting-started-illustration.svg';

const GETTING_STARTED_MODAL_KEY = 'application-list-getting-started-modal';

const ApplicationsPage = () => {
  useQuickstartCloseOnUnmount();
  const [hacbs] = useFeatureFlag(HACBS_FLAG);
  return (
    <NamespacedPage>
      {hacbs ? (
        <HacBSGettingStartedModal
          imgAlt="App studio"
          imgSrc={imageUrl}
          imgClassName="pf-u-justify-content-center pf-u-px-4xl"
        />
      ) : (
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
      )}
      <Helmet>
        <title>Application List Page</title>
      </Helmet>
      <ApplicationListView />
    </NamespacedPage>
  );
};

export default ApplicationsPage;
