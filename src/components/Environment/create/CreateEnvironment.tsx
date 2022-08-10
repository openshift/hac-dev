import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Formik } from 'formik';
import { EnvironmentModel } from '../../../models';
import { EnvironmentKind } from '../../../types';
import { useNamespace } from '../../../utils/namespace-context-utils';
import {
  EnvironmentDeploymentStrategy,
  EnvironmentFormDropdownType,
  environmentFormSchema,
} from '../environment-utils';
import CreateEnvironmentForm, { CreateEnvironmentFormValues } from './CreateEnvironmentForm';

const CreateEnvironment: React.FC = () => {
  const navigate = useNavigate();
  const namespace = useNamespace();
  const initialValues: CreateEnvironmentFormValues = {
    name: '',
    deploymentStrategy: 'Automatic',
    type: '',
    location: 'Development Sandbox',
  };

  const handleSubmit = React.useCallback(
    (values: CreateEnvironmentFormValues, actions) => {
      const resource: EnvironmentKind = {
        apiVersion: `${EnvironmentModel.apiGroup}/${EnvironmentModel.apiVersion}`,
        kind: EnvironmentModel.kind,
        metadata: { name: values.name.toLowerCase().trim().split(' ').join('-'), namespace },
        spec: {
          type: EnvironmentFormDropdownType[values.type],
          displayName: values.name,
          deploymentStrategy: EnvironmentDeploymentStrategy[values.deploymentStrategy],
          parentEnvironment: values.parentEnvironment,
        },
      };
      k8sCreateResource({ model: EnvironmentModel, resource })
        .then(() => {
          navigate(`/app-studio/workspace-settings`);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          actions.setSubmitting(false);
          actions.setStatus({ submitError: error.message });
        });
    },
    [navigate, namespace],
  );

  const handleReset = React.useCallback(() => {
    navigate(`/app-studio/workspace-settings`);
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
