import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { useQueryParams } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { CreateApplicationForm, CreateApplicationValues } from './CreateApplicationForm';

export const CreateApplicationPage = () => {
  const { handleNext, handleReset: wizardHandleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const queryParams = useQueryParams();

  useActiveNamespace();

  const initialValues: CreateApplicationValues = React.useMemo(
    () => ({
      workspace: formState.workspace ?? 'Purple_workspace',
      application: formState.application ?? 'Purple Mermaid app',
    }),
    [formState.application, formState.workspace],
  );

  const handleSubmit = (values: CreateApplicationValues) => {
    setValues((prevVal) => ({ ...prevVal, ...values }));
    handleNext();
  };

  const handleReset = () => {
    wizardHandleReset();
    setValues({});
  };

  React.useEffect(() => {
    const existingApplication = queryParams.get('application');
    if (existingApplication) {
      setValues((prevVal) => ({ ...prevVal, ...initialValues, existingApplication }));
      handleNext();
    }
  }, [handleNext, initialValues, queryParams, setValues]);

  return (
    <Formik onSubmit={handleSubmit} onReset={handleReset} initialValues={initialValues}>
      {(props: FormikProps<CreateApplicationValues>) => <CreateApplicationForm {...props} />}
    </Formik>
  );
};
