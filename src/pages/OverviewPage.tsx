import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import AboutSection from '../components/Overview/AboutSection';
import InfoBanner from '../components/Overview/InfoBanner';
import IntroBanner from '../components/Overview/IntroBanner';
import { FULL_APPLICATION_TITLE } from '../consts/labels';

const OverviewPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <NamespacedPage hideAppBanner skipWorkspaceCheck>
      <Helmet>
        <title>Overview | {FULL_APPLICATION_TITLE}</title>
      </Helmet>
      <IntroBanner />
      <InfoBanner />
      <PageSection isFilled>
        <AboutSection />
      </PageSection>
    </NamespacedPage>
  );
};

export default OverviewPage;
