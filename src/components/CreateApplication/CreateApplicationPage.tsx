import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, FormikProps } from 'formik';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { useQueryParams, Page } from '../../shared';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';
import { CreateApplicationForm, CreateApplicationValues } from './CreateApplicationForm';

export const CreateApplicationPage = () => {
  const { handleNext, handleReset: wizardHandleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const queryParams = useQueryParams();
  const history = useHistory();

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
      queryParams.delete('application');
      history.replace({ search: queryParams.toString() });
    }
  }, [handleNext, history, initialValues, queryParams, setValues]);

  return (
    <Page
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Create your application"
      description="To create an application, first enter an application name."
      isSection
    >
      <Formik onSubmit={handleSubmit} onReset={handleReset} initialValues={initialValues}>
        {(props: FormikProps<CreateApplicationValues>) => <CreateApplicationForm {...props} />}
      </Formik>
    </Page>
  );
};
