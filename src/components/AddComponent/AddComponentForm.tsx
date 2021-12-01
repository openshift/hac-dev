import { Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { FormFooter } from '../../shared';
import { SourceField } from './SourceField';
import { useWizardContext } from '../Wizard/Wizard';
import { useFormValues } from '../form-context';

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
