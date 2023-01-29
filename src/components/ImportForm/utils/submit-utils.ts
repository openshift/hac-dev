import { FormikHelpers } from 'formik';
import { SAMPLE_ANNOTATION } from '../../../utils/component-utils';
import { createApplication, createComponent } from '../../../utils/create-utils';
import { detectComponents } from './cdq-utils';
import { transformResources, transformComponentValues } from './transform-utils';
import { DetectedFormComponent, ImportFormValues, ImportStrategy } from './types';

export const createComponents = async (
  components: DetectedFormComponent[],
  application: string,
  namespace: string,
  secret?: string,
  dryRun?: boolean,
  enablePac?: boolean,
  annotations?: { [key: string]: string },
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
      annotations,
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
  let componentAnnotations: { [key: string]: string };

  if (strategy === ImportStrategy.SAMPLE) {
    const detectedSampleComponents = await detectComponents(
      source.git.url,
      application,
      namespace,
      secret,
      source.git.context,
      source.git.revision,
    );
    detectedComponents = transformComponentValues(detectedSampleComponents);
    componentAnnotations = { [SAMPLE_ANNOTATION]: 'true' };
  }

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace, true);
    applicationName = applicationData.metadata.name;
  }

  await createComponents(
    detectedComponents,
    applicationName,
    namespace,
    secret,
    true,
    pipelinesascode === 'automatic',
    componentAnnotations,
  );

  if (shouldCreateApplication) {
    const applicationData = await createApplication(application, namespace);
    applicationName = applicationData.metadata.name;
  }

  const createdComponents = await createComponents(
    detectedComponents,
    applicationName,
    namespace,
    secret,
    false,
    pipelinesascode === 'automatic',
    componentAnnotations,
  );

  return { applicationName, componentNames: createdComponents.map((c) => c.metadata.name) };
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
