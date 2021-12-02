import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import { AddComponentForm, AddComponentValues } from './AddComponentForm';

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
