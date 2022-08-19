import React from 'react';
import {
  PageSection,
  FormSection,
  Form,
  TextContent,
  PageSectionVariants,
} from '@patternfly/react-core';
import { FormikProps, FormikValues } from 'formik';
import isEmpty from 'lodash/isEmpty';
import PageLayout from '../../../components/PageLayout/PageLayout';
import { FormFooter } from '../../../shared';
import IntegrationTestSection, { IntegrationTestDescription } from './IntegrationTestSection';

import '../../../shared/style.scss';

type IntegrationTestFormProps = {
  applicationName: string;
};

const IntegrationTestForm: React.FunctionComponent<
  FormikProps<FormikValues> & IntegrationTestFormProps
> = ({ applicationName, handleSubmit, handleReset, isSubmitting, status, errors }) => {
  const footer = (
    <FormFooter
      submitLabel="Save"
      handleCancel={handleReset}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disableSubmit={!isEmpty(errors) || isSubmitting}
      errorMessage={status?.submitError}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: `/app-studio/applications?name=${applicationName}`, name: applicationName },
        { path: '#', name: 'Integration test pipeline' },
      ]}
      title="Add integration test pipeline"
      description={
        <TextContent>
          <IntegrationTestDescription />
        </TextContent>
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
