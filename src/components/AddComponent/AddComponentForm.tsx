import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { SourceField } from './SourceField';

export type AddComponentValues = {
  source: string;
};

type AddComponentFormProps = FormikProps<AddComponentValues>;

export const AddComponentForm: React.FC<AddComponentFormProps> = ({
  dirty,
  errors,
  status,
  isSubmitting,
  handleSubmit,
  handleReset,
}) => {
  const { handleNext, handleReset: wizardHandleReset } = useWizardContext();
  const [, setValues] = useFormValues();

  return (
    <Form onSubmit={handleSubmit}>
      <SourceField onSamplesClick={handleNext} />
      <FormFooter
        submitLabel="Next"
        resetLabel="Back"
        handleReset={handleReset}
        errorMessage={status && status.submitError}
        handleCancel={() => {
          wizardHandleReset();
          setValues({});
        }}
        isSubmitting={isSubmitting}
        disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
      />
    </Form>
  );
};
