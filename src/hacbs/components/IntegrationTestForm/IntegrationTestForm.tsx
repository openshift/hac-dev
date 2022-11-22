import React from 'react';
import { Form, FormSection, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import isEmpty from 'lodash/isEmpty';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { FormFooter } from '../../../shared';
import IntegrationTestSection from './IntegrationTestSection';

import '../../../shared/style.scss';

type IntegrationTestFormProps = {
  applicationName: string;
};

const IntegrationTestForm: React.FunctionComponent<IntegrationTestFormProps> = ({
  applicationName,
}) => {
  const { dirty, handleSubmit, handleReset, isSubmitting, status, errors } = useFormikContext();
  const footer = (
    <FormFooter
      submitLabel="Add integration test"
      handleCancel={handleReset}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
      errorMessage={status?.submitError}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: `/app-studio/applications/${applicationName}`, name: applicationName },
        {
          path: `/app-studio/applications/${applicationName}?activeTab=integrationtests`,
          name: 'Integration tests',
        },
        { path: '#', name: 'Integration test' },
      ]}
      title="Add integration test"
      description={
        <>
          Add an integration test to test all your components.
          <br />
          By default, previous GitHub credentials will be used to validate your URL. If it fails,
          you must revalidate with a different repo.
          <br />
        </>
      }
      footer={footer}
    >
      <PageSection isFilled variant={PageSectionVariants.light}>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <IntegrationTestSection isInPage />
          </FormSection>
        </Form>
      </PageSection>
    </PageLayout>
  );
};

export default IntegrationTestForm;
