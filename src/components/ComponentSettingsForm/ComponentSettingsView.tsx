import React from 'react';
import { useHistory } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Formik } from 'formik';
import { ComponentGroupVersionKind } from '../../models';
import { ComponentKind } from '../../types';
import { createComponent } from '../../utils/create-utils';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import { createResourceData, transformResources } from '../ReviewComponents/utils';
import { reviewFormSchema } from '../ReviewComponents/validation-utils';
import ComponentSettingsForm from './ComponentSettingsForm';

type ComponentSettingsViewProps = {
  componentName: string;
};

const ComponentSettingsView: React.FunctionComponent<ComponentSettingsViewProps> = ({
  componentName,
}) => {
  const history = useHistory();
  const { namespace } = React.useContext(NamespaceContext);

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
    components: {
      [componentName]: {
        ...component.spec,
        name: component.spec.componentName,
        resources: createResourceData(component.spec.resources || {}),
      },
    },
  };

  const handleSubmit = (values, actions) => {
    const componentValues = values.components[componentName];
    const applicationName = componentValues.application;

    const transformedComponentValues = {
      name: componentValues.name,
      gitRepo: componentValues.source.git.url,
      devfileUrl: componentValues.source.git.devfileUrl,
      replicas: componentValues.replicas && Number(componentValues.replicas),
      targetPort: componentValues.targetPort && Number(componentValues.targetPort),
      resources: componentValues.resources && transformResources(componentValues.resources),
      env: componentValues.env,
      revision: componentValues.source.git.revision,
      context: componentValues.source.git.context,
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
        history.push(`/app-studio/applications?name=${applicationName}`);
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
      onReset={history.goBack}
      initialValues={initialValues}
      validationSchema={reviewFormSchema}
    >
      {(props) => <ComponentSettingsForm {...props} component={component} />}
    </Formik>
  );
};

export default ComponentSettingsView;
