import { Formik, FormikProps } from 'formik';
import * as React from 'react';
import { Page } from '../Page';
import { AddComponentForm } from './AddComponentForm';
import { AddComponentValues } from './type';
import { useWizardContext } from '../Wizard/Wizard';
import { useFormValues } from '../form-fields/form-context';

export const AddComponentPage = () => {
  const initialValues = {
    source: '',
  };

  const { handleBack } = useWizardContext();
  const [, setValues] = useFormValues();

  const handleSubmit = (values: AddComponentValues) => {
    setValues((prevVal) => ({ ...prevVal, ...values }));
  };

  return (
    <Page
      breadcrumbs={[
        { path: '#', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Start building your application"
      description="Get started building your application by entering source code or a container image"
    >
      <Formik onSubmit={handleSubmit} onReset={handleBack} initialValues={initialValues}>
        {(props: FormikProps<AddComponentValues>) => <AddComponentForm {...props} />}
      </Formik>
    </Page>
  );
};
