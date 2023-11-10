import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Formik } from 'formik';
import { useComponent } from '../../hooks/useComponents';
import ErrorEmptyState from '../../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../../shared/utils/error/http-error';
import { useTrackEvent, TrackEvents } from '../../utils/analytics';
import { createComponent } from '../../utils/create-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createResourceData, transformResources } from '../ImportForm/utils/transform-utils';
import { reviewValidationSchema } from '../ImportForm/utils/validation-utils';
import DeploymentSettingsForm from './DeploymentSettingsForm';

type DeploymentSettingsViewProps = {
  componentName: string;
};

const DeploymentSettingsView: React.FunctionComponent<
  React.PropsWithChildren<DeploymentSettingsViewProps>
> = ({ componentName }) => {
  const track = useTrackEvent();
  const navigate = useNavigate();
  const { appName } = useParams();
  const { namespace, workspace } = useWorkspaceInfo();
  const [component, loaded, componentError] = useComponent(namespace, componentName);

  if (componentError) {
    const appError = HttpError.fromCode((componentError as any).code);
    return (
      <ErrorEmptyState
        httpError={appError}
        title={`Unable to load component ${componentName}`}
        body={appError.message}
      />
    );
  }

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  const initialValues = {
    application: appName,
    components: [
      {
        componentStub: {
          ...component.spec,
          resources: createResourceData(component.spec.resources || {}),
        },
      },
    ],
    namespace,
    isDetected: true,
    importSecrets: [],
    newSecrets: [],
  };

  const handleSubmit = async (values, actions) => {
    const componentValues = values.components[0].componentStub;
    const applicationName = componentValues.application;

    const transformedComponentValues = {
      ...componentValues,
      replicas: componentValues.replicas && Number(componentValues.replicas),
      targetPort: componentValues.targetPort && Number(componentValues.targetPort),
      resources: componentValues.resources && transformResources(componentValues.resources),
    };

    track(TrackEvents.ButtonClicked, {
      link_name: 'edit-component-submit',
      component_name: component.metadata.name,
      app_name: applicationName,
      workspace,
    });

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
        track('Component Edited', {
          app_name: component.spec.application,
          component_name: component.metadata.name,
          workspace,
        });
        navigate(
          `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/components`,
        );
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error while submitting deployment settings form:', error);
        actions.setSubmitting(false);
        actions.setStatus({ submitError: error.message });
      });
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      onReset={() => {
        track(TrackEvents.ButtonClicked, {
          link_name: 'edit-component-leave',
          app_name: component.spec.application,
          component_name: component.metadata.name,
          workspace,
        });
        navigate(-1);
      }}
      initialValues={initialValues}
      validationSchema={reviewValidationSchema}
    >
      {(props) => <DeploymentSettingsForm {...props} />}
    </Formik>
  );
};

export default DeploymentSettingsView;
