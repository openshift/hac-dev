import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { TrackEvents, useTrackEvent } from '../../../utils/analytics';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createEnvironment, environmentFormSchema } from '../environment-utils';
import CreateEnvironmentForm, { CreateEnvironmentFormValues } from './CreateEnvironmentForm';

const CreateEnvironment: React.FC = () => {
  const navigate = useNavigate();
  const track = useTrackEvent();
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
      track(TrackEvents.ButtonClicked, { link_name: 'create-environment-submit', workspace });
      createEnvironment(values, namespace, true)
        .then(() => createEnvironment(values, namespace))
        .then((env) => {
          track('Environment Create', {
            environment: env.metadata.name,
            environment_id: env.metadata.uid,
            clusterType: env.spec?.unstableConfigurationFields?.clusterType,
            deploymentStrategy: env.spec?.deploymentStrategy,
            workspace,
          });
          navigate(`/application-pipeline/environments/workspaces/${workspace}`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          actions.setSubmitting(false);
          actions.setStatus({ submitError: error.message });
        });
    },
    [navigate, namespace, workspace, track],
  );

  const handleReset = React.useCallback(() => {
    track(TrackEvents.ButtonClicked, { link_name: 'create-environment-leave', workspace });
    navigate(-1);
  }, [navigate, track, workspace]);

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
