import React from 'react';
import { Helmet } from 'react-helmet';
import { ApplicationEnvironmentDetailsView } from '../components/ApplicationEnvironment/ApplicationEnvironmentDetailsView';
import { GettingStartedModal } from '../components/modal/GettingStartedModal';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import imageUrl from '../imgs/getting-started-illustration.svg';
import { getQueryArgument } from '../shared/utils';

const GETTING_STARTED_MODAL_KEY = 'application-environment-details-getting-started-modal';

const ApplicationEnvironmentDetailsPage = () => {
  useQuickstartCloseOnUnmount();
  const applicationName = getQueryArgument('application');
  const environmentName = getQueryArgument('name');

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
      <Helmet>
        <title>Environment Details Page</title>
      </Helmet>
      <ApplicationEnvironmentDetailsView
        applicationName={applicationName}
        environmentName={environmentName}
      />
    </NamespacedPage>
  );
};

export default ApplicationEnvironmentDetailsPage;
