import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageSection } from '@patternfly/react-core';
import AboutSection from '../components/Overview/AboutSection';
import InfoBanner from '../components/Overview/InfoBanner';
import IntroBanner from '../components/Overview/IntroBanner';

const OverviewPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Overview Page | CI/CD</title>
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
