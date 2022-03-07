import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import { FormFooter } from '../../shared';
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
  return (
    <Form style={{ maxWidth: '50%' }} onSubmit={handleSubmit}>
      <ApplicationField />
      <FormFooter
        submitLabel="Next"
        errorMessage={status && status.submitError}
        handleCancel={handleReset}
        isSubmitting={isSubmitting}
        disableSubmit={isSubmitting}
        sticky
      />
    </Form>
  );
};
