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
          gitRepo: component.source.git.url,
          devfileUrl: component.source.git.devfileUrl,
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
) => {
  const shouldCreateApplication = !formState.existingApplication;
  let appName = formState.existingApplication;
  if (shouldCreateApplication) {
    const appData = await createApplication(formState.application, formState.namespace);
    appName = appData.metadata.name;
  }

  await createComponents(components, appName, formState.namespace);

  const applicationData = await createApplication(formState.application, formState.namespace);
  appName = applicationData.metadata.name;
  // eslint-disable-next-line no-console
  console.log('###############- Application created', applicationData);

  const componentData = await createComponents(components, appName, formState.namespace);
  // eslint-disable-next-line no-console
  console.log('###############- Components created', componentData);
  return appName;
};
