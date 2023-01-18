import { FormikHelpers } from 'formik';
import { createApplication, createComponent } from '../../../utils/create-utils';
import { detectComponents } from './cdq-utils';
import { transformResources, sampleComponentValues } from './transform-utils';
import { DetectedFormComponent, ImportFormValues, ImportStrategy } from './types';

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

export const createResources = async (formValues: ImportFormValues, strategy: ImportStrategy) => {
  const { source, application, inAppContext, components, secret, namespace, pipelinesascode } =
    formValues;
  const shouldCreateApplication = !inAppContext;
  let applicationName = application;
  let detectedComponents = components;
  if (strategy === ImportStrategy.SAMPLE) {
    const detectedSampleComponents = await detectComponents(
      source.git.url,
      application,
      namespace,
      secret,
      source.git.context,
      source.git.revision,
    );
    detectedComponents = sampleComponentValues(application, detectedSampleComponents);
  }

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace, true);
    applicationName = applicationData.metadata.name;
  }

  await createComponents(detectedComponents, applicationName, namespace, secret, true);

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace);
    applicationName = applicationData.metadata.name;
  }

  await createComponents(
    detectedComponents,
    applicationName,
    namespace,
    secret,
    false,
    pipelinesascode,
  );

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
