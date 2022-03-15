import * as React from 'react';
import { Formik } from 'formik';
import { Page } from '../../shared';
import { useFormValues } from '../form-context';
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
      isMultiComponent: formState.isMultiComponent,
      authSecret: formState.sourceSecret,
    },
  };

  const handleSubmit = (values: AddComponentValues) => {
    setValues((prevVal) => ({
      ...prevVal,
      source: values.source,
      sourceSecret: values.git.authSecret,
      isMultiComponent: values.git.isMultiComponent,
      components: values.detectedComponents.map((component) => ({
        name: component.name,
        uid: component.name,
        type: 'source',
        data: {
          source: component.source,
          contextDir: component.context,
          targetPort: component.targetPort,
          resources: component.resources,
          replicas: component.replicas,
          route: component.route,
          env: component.env,
        },
      })),
    }));
    increaseStepBy(2);
  };

  return (
    <Page
      breadcrumbs={[
        { path: '/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Build your application"
      description="To get started, enter source code or a container image."
      isSection
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
