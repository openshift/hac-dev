import * as React from 'react';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { FormFooter } from '../../shared';
import PageLayout from '../PageLayout/PageLayout';
import { ApplicationField } from './ApplicationField';

export type CreateApplicationValues = {
  workspace: string;
  application: string;
};

type CreateApplicationFormProps = FormikProps<CreateApplicationValues>;

export const CreateApplicationForm: React.FC<CreateApplicationFormProps> = ({
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
}) => {
  const footer = (
    <FormFooter
      submitLabel="Next"
      errorMessage={status && status.submitError}
      handleSubmit={handleSubmit}
      handleCancel={handleReset}
      isSubmitting={isSubmitting}
      disableSubmit={isSubmitting}
    />
  );
  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Create your application"
      description="Enter an application name."
      footer={footer}
    >
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Form style={{ maxWidth: '50%' }} onSubmit={handleSubmit}>
          <ApplicationField />
        </Form>
      </PageSection>
    </PageLayout>
  );
};
