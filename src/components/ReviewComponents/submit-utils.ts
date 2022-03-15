import { Dispatch } from 'redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { createApplication, createComponent } from '../../utils/create-utils';
import { FormState } from '../form-context';
import { ReviewComponentsFormValues } from './types';
import { transformResources } from './utils';

const createComponents = async (
  components: ReviewComponentsFormValues['components'],
  application: string,
  namespace: string,
  secret?: string,
  dryRun?: boolean,
) => {
  return Promise.all(
    Object.values(components).map((component) => {
      return createComponent(
        {
          name: component.name,
          gitRepo: component.source,
          replicas: component.replicas && Number(component.replicas),
          targetPort: component.targetPort && Number(component.targetPort),
          resources: component.resources && transformResources(component.resources),
        },
        application,
        namespace,
        secret,
        dryRun,
      );
    }),
  );
};

export const createResources = async (
  formState: FormState,
  components: ReviewComponentsFormValues['components'],
  dispatch: Dispatch,
) => {
  const shouldCreateApplication = !formState.existingApplication;
  let appName = formState.existingApplication;
  if (shouldCreateApplication) {
    try {
      const appData = await createApplication(formState.application, formState.namespace, true);
      appName = appData.metadata.name;
    } catch (error) {
      dispatch(
        addNotification({
          variant: 'danger',
          title: 'Application creation failed!!',
          description: error.message,
        }),
      );
      throw error;
    }
  }

  try {
    await createComponents(components, appName, formState.namespace, formState.sourceSecret, true);
  } catch (error) {
    dispatch(
      addNotification({
        variant: 'danger',
        title: 'Component creation failed!!',
        description: error.message,
      }),
    );
    throw error;
  }

  if (shouldCreateApplication) {
    try {
      const applicationData = await createApplication(formState.application, formState.namespace);
      appName = applicationData.metadata.name;
      // eslint-disable-next-line no-console
      console.log('###############- Application created', applicationData);
    } catch (error) {
      dispatch(
        addNotification({
          variant: 'danger',
          title: 'Application creation failed!!',
          description: error.message,
        }),
      );
      throw error;
    }
  }

  try {
    const componentData = await createComponents(
      components,
      appName,
      formState.namespace,
      formState.sourceSecret,
    );
    // eslint-disable-next-line no-console
    console.log('###############- Components created', componentData);
  } catch (error) {
    dispatch(
      addNotification({
        variant: 'danger',
        title: 'Component creation failed!!',
        description: error.message,
      }),
    );
    throw error;
  }
  dispatch(
    addNotification({
      variant: 'success',
      title: 'Application and components created successfully!!',
      description: `Created application ${appName} with components ${formState.components
        .map((c) => c.name)
        .join(', ')}`,
    }),
  );
  return appName;
};
