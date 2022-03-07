import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { GitOptions } from './GitOptions';
import { SourceField } from './SourceField';

export type AddComponentValues = {
  source: string;
  git: {
    reference: string;
    contextDir: string;
    isMultiComponent: boolean;
    authSecret?: string;
  };
  detectedComponents?: {
    name: string;
    git: {
      url: string;
    };
    context: string;
    resources?: {
      limits?: { cpu?: string; memory?: string };
      requests?: { cpu?: string; memory?: string };
    };
    devfileFound?: boolean;
    targetPort?: number;
    route?: string;
    replicas?: number;
    env?: { name: string; value: string }[];
  }[];
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
      <GitOptions />
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
        sticky
      />
    </Form>
  );
};
