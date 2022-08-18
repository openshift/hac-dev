import { FormikHelpers } from 'formik';
import { createApplication, createComponent } from '../../../utils/create-utils';
import { transformResources } from './transform-utils';
import { DetectedFormComponent, ImportFormValues } from './types';

export const createComponents = async (
  components: DetectedFormComponent[],
  application: string,
  namespace: string,
  secret?: string,
  dryRun?: boolean,
  enablePac?: boolean,
) => {
  const createComponentPromises = components.map((component) => {
    const componentData = component.componentStub;
    const componentValues = {
      ...componentData,
      resources: componentData.resources && transformResources(componentData.resources),
      replicas: componentData.replicas && Number(componentData.replicas),
      targetPort: componentData.targetPort && Number(componentData.targetPort),
    };
    return createComponent(
      componentValues,
      application,
      namespace,
      secret,
      dryRun,
      null,
      'create',
      enablePac,
    );
  });

  return Promise.all(createComponentPromises);
};

export const createResources = async (formValues: ImportFormValues) => {
  const { application, inAppContext, components, secret, namespace } = formValues;
  const shouldCreateApplication = !inAppContext;
  let applicationName = application;

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace, true);
    applicationName = applicationData.metadata.name;
  }

  await createComponents(components, applicationName, namespace, secret, true);

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace);
    applicationName = applicationData.metadata.name;
  }

  await createComponents(components, applicationName, namespace, secret);

  return applicationName;
};

export const checkApplicationName = async (
  values: ImportFormValues,
  formikHelpers: FormikHelpers<ImportFormValues>,
) => {
  const { application, namespace } = values;
  try {
    await createApplication(application, namespace, true);
    formikHelpers.setStatus({});
  } catch (error) {
    const message = error.code === 409 ? 'Application name already exists.' : error.message;
    formikHelpers.setStatus({ submitError: message });
    throw error;
  }
};
