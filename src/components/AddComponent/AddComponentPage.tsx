import * as React from 'react';
import { Formik } from 'formik';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import { AddComponentForm, AddComponentValues } from './AddComponentForm';
import { validationSchema } from './validation-utils';

export const AddComponentPage = () => {
  const [formState, setValues] = useFormValues();
  const { handleBack, increaseStepBy } = useWizardContext();
  const initialValues: AddComponentValues = {
    source: formState.source ?? '',
    git: {
      reference: '',
      contextDir: '/',
    },
  };

  const handleSubmit = (values: AddComponentValues) => {
    setValues((prevVal) => ({
      ...prevVal,
      source: values.source,
      components: values.detectedComponents.map((component) => ({
        name: component.name,
        uid: component.name,
        type: 'source',
        data: {
          source: component.git.url,
          contextDir: component.git.path,
          targetPort: component.targetPort,
          language: component.language,
          projectType: component.projectType,
          resources: component.resources,
        },
      })),
    }));
    increaseStepBy(2);
  };

  return (
    <Page
      breadcrumbs={[
        { path: '#', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Build your application"
      description="To get started, enter source code or a container image."
    >
      <Formik
        onSubmit={handleSubmit}
        onReset={handleBack}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(props) => <AddComponentForm {...props} />}
      </Formik>
    </Page>
  );
};
