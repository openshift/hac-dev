import * as React from 'react';
import { Form, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { FormikProps } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-context';
import PageLayout from '../PageLayout/PageLayout';
import { useWizardContext } from '../Wizard/Wizard';
import { SourceSection } from './SourceSection';

export type AddComponentValues = {
  source: string;
  git: {
    reference: string;
    contextDir: string;
    isMultiComponent: boolean;
    authSecret?: string;
  };
  validated: boolean;
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
  const footer = (
    <FormFooter
      submitLabel="Next"
      resetLabel="Back"
      handleSubmit={handleSubmit}
      handleReset={handleReset}
      errorMessage={status && status.submitError}
      handleCancel={() => {
        wizardHandleReset();
        setValues({});
      }}
      isSubmitting={isSubmitting}
      disableSubmit={!dirty || !isEmpty(errors) || isSubmitting}
    />
  );
  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Build your application"
      description="To get started, enter source code or a container image."
      footer={footer}
    >
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Form onSubmit={handleSubmit}>
          <SourceSection onSamplesClick={handleNext} />
        </Form>
      </PageSection>
    </PageLayout>
  );
};
