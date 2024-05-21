import * as React from 'react';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useApplicationBreadcrumbs } from '../../utils/breadcrumb-utils';
import PageLayout from '../PageLayout/PageLayout';
import { GitImportForm } from './GitImportForm';

const ImportForm: React.FC<{ applicationName: string }> = ({ applicationName }) => {
  const applicationBreadcrumbs = useApplicationBreadcrumbs(applicationName);
  return (
    <PageLayout
      breadcrumbs={[...applicationBreadcrumbs, { path: '#', name: 'Create an application' }]}
      title="Create an application"
      description="An application is one or more components that run together."
    >
      <PageSection variant={PageSectionVariants.light} padding={{ default: 'noPadding' }}>
        <GitImportForm applicationName={applicationName} />
      </PageSection>
    </PageLayout>
  );
};

export default ImportForm;
