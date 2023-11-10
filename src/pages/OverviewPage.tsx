import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection } from '@patternfly/react-core';
import AboutSection from '../components/Overview/AboutSection';
import InfoBanner from '../components/Overview/InfoBanner';
import IntroBanner from '../components/Overview/IntroBanner';
import { FULL_APPLICATION_TITLE } from '../consts/labels';

// PF 5 CSS
// TODO: Remove when console is at PF 5
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';

const OverviewPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <>
      <Helmet>
        <title>Overview | {FULL_APPLICATION_TITLE}</title>
      </Helmet>
      <IntroBanner />
      <InfoBanner />
      <PageSection isFilled>
        <AboutSection />
      </PageSection>
    </>
  );
};

export default OverviewPage;
