import * as React from 'react';
import { Formik } from 'formik';
import { useFormValues } from '../form-context';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import { useWizardContext } from '../Wizard/Wizard';
import { AddComponentForm, AddComponentValues } from './AddComponentForm';
import { validationSchema } from './validation-utils';

export const AddComponentPage = () => {
  const { namespace } = React.useContext(NamespaceContext);
  const [formState, setFormValues] = useFormValues();
  const { handleBack, increaseStepBy } = useWizardContext();
  const initialValues: AddComponentValues = {
    source: formState.source ?? '',
    git: {
      reference: '',
      contextDir: '/',
      isMultiComponent: formState.isMultiComponent,
      authSecret: formState.git?.authSecret,
    },
    validated: false,
  };

  const handleSubmit = (values: AddComponentValues) => {
    setFormValues((prevVal) => ({
      ...prevVal,
      source: values.source,
      git: {
        ...values.git,
      },
      sourceSecret: values.git.authSecret,
      isMultiComponent: values.git.isMultiComponent,
    }));
    increaseStepBy(2);
  };

  React.useEffect(() => {
    let mounted = true;

    if (mounted) {
      setFormValues((formValues) => ({ ...formValues, namespace }));
    }

    return () => {
      mounted = false;
    };
  }, [namespace, setFormValues]);

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={handleBack}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {(props) => <AddComponentForm {...props} />}
    </Formik>
  );
};
