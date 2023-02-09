import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Formik } from 'formik';
import { ComponentGroupVersionKind } from '../../models';
import { ComponentKind } from '../../types';
import { createComponent } from '../../utils/create-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createResourceData, transformResources } from '../ImportForm/utils/transform-utils';
import { reviewValidationSchema } from '../ImportForm/utils/validation-utils';
import ComponentSettingsForm from './ComponentSettingsForm';

type ComponentSettingsViewProps = {
  componentName: string;
};

const ComponentSettingsView: React.FunctionComponent<ComponentSettingsViewProps> = ({
  componentName,
}) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();

  const [component, loaded] = useK8sWatchResource<ComponentKind>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    name: componentName,
  });

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const initialValues = {
    components: [
      {
        componentStub: {
          ...component.spec,
          resources: createResourceData(component.spec.resources || {}),
        },
      },
    ],
    isDetected: true,
  };

  const handleSubmit = (values, actions) => {
    const componentValues = values.components[0].componentStub;
    const applicationName = componentValues.application;

    const transformedComponentValues = {
      ...componentValues,
      replicas: componentValues.replicas && Number(componentValues.replicas),
      targetPort: componentValues.targetPort && Number(componentValues.targetPort),
      resources: componentValues.resources && transformResources(componentValues.resources),
    };

    return createComponent(
      transformedComponentValues,
      applicationName,
      namespace,
      '',
      false,
      component,
      'update',
    )
      .then(() => {
        navigate(`/stonesoup/workspaces/${workspace}/applications/${applicationName}/components`);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error while submitting import form:', error);
        actions.setSubmitting(false);
        actions.setStatus({ submitError: error.message });
      });
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={() => navigate(-1)}
      initialValues={initialValues}
      validationSchema={reviewValidationSchema}
    >
      {(props) => <ComponentSettingsForm {...props} />}
    </Formik>
  );
};

export default ComponentSettingsView;
