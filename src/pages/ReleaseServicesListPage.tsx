import React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageLayout from '../components/PageLayout/PageLayout';
import { ReleaseService } from '../components/ReleaseService/ReleaseService';

const ReleaseListPage: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <NamespacedPage>
      <PageLayout title="Release services">
        <PageSection variant={PageSectionVariants.light} isFilled>
          <ReleaseService />
        </PageSection>
      </PageLayout>
    </NamespacedPage>
  );
};

export default ReleaseListPage;
