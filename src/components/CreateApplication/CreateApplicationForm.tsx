import { Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import * as React from 'react';
import { FormFooter } from '../../shared';
import { ApplicationField } from '../form-fields/ApplicationField';
import { WorkspaceField } from '../form-fields/WorkspaceField';
import { CreateApplicationValues } from './type';

type CreateApplicationFormProps = FormikProps<CreateApplicationValues>;

export const CreateApplicationForm: React.FC<CreateApplicationFormProps> = ({
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
}) => {
  return (
    <Form style={{ maxWidth: '50%' }} onSubmit={handleSubmit}>
      <WorkspaceField />
      <ApplicationField />
      <FormFooter
        submitLabel="Next"
        errorMessage={status && status.submitError}
        handleCancel={handleReset}
        isSubmitting={isSubmitting}
        disableSubmit={isSubmitting}
      />
    </Form>
  );
};
