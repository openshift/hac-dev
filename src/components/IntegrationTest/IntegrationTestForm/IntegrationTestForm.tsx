import React from 'react';
import { Form, FormSection, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../../shared';
import { useApplicationBreadcrumbs } from '../../../utils/breadcrumb-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import PageLayout from '../../PageLayout/PageLayout';
import IntegrationTestSection from './IntegrationTestSection';

import '../../../shared/style.scss';

type IntegrationTestFormProps = {
  applicationName: string;
  edit?: boolean;
};

const IntegrationTestForm: React.FunctionComponent<
  React.PropsWithChildren<IntegrationTestFormProps>
> = ({ applicationName, edit }) => {
  const { workspace } = useWorkspaceInfo();
  const applicationBreadcrumbs = useApplicationBreadcrumbs();
  const { dirty, handleSubmit, handleReset, isSubmitting, status, errors } = useFormikContext();
  const footer = (
    <FormFooter
      submitLabel={edit ? 'Save changes' : 'Add integration test'}
      handleCancel={handleReset}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
      errorMessage={status?.submitError}
    />
  );

  const title = edit ? 'Edit integration test' : 'Add integration test';

  return (
    <PageLayout
      breadcrumbs={[
        ...applicationBreadcrumbs,
        {
          path: `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/integrationtests`,
          name: 'Integration tests',
        },
        { path: '#', name: title },
      ]}
      title={title}
      description="Test all your components after you commit code by adding an integration test. Integration tests run in parallel using temporary environments."
      footer={footer}
    >
      <PageSection isFilled variant={PageSectionVariants.light}>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <IntegrationTestSection isInPage edit={edit} />
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default IntegrationTestForm;
