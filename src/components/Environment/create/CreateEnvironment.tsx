import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createEnvironment, environmentFormSchema } from '../environment-utils';
import CreateEnvironmentForm, { CreateEnvironmentFormValues } from './CreateEnvironmentForm';

const CreateEnvironment: React.FC = () => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();

  const initialValues: CreateEnvironmentFormValues = {
    name: '',
    deploymentStrategy: 'Automatic',
    clusterType: '',
    kubeconfig: '',
    targetNamespace: '',
  };

  const handleSubmit = React.useCallback(
    (values: CreateEnvironmentFormValues, actions) => {
      createEnvironment(values, namespace, true)
        .then(() => createEnvironment(values, namespace))
        .then(() => navigate(`/stonesoup/environments/workspaces/${workspace}`))
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          actions.setSubmitting(false);
          actions.setStatus({ submitError: error.message });
        });
    },
    [navigate, namespace, workspace],
  );

  const handleReset = React.useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Formik
      validationSchema={environmentFormSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {(props) => <CreateEnvironmentForm {...props} />}
    </Formik>
  );
};

export default CreateEnvironment;
