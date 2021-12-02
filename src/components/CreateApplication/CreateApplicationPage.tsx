import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import { CreateApplicationForm, CreateApplicationValues } from './CreateApplicationForm';

export const CreateApplicationPage = () => {
  const { handleNext, handleReset: wizardHandleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const initialValues = {
    workspace: formState.workspace ?? 'Purple_workspace',
    application: formState.application ?? 'Purple Mermaid app',
  };
  const handleSubmit = (values: CreateApplicationValues) => {
    setValues((prevVal) => ({ ...prevVal, ...values }));
    handleNext();
  };
  const handleReset = () => {
    wizardHandleReset();
    setValues({});
  };
  return (
    <Page
      breadcrumbs={[
        { path: '#', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Create your application"
      description="To create an application, first enter an application name."
    >
      <Formik onSubmit={handleSubmit} onReset={handleReset} initialValues={initialValues}>
        {(props: FormikProps<CreateApplicationValues>) => <CreateApplicationForm {...props} />}
      </Formik>
    </Page>
  );
};
