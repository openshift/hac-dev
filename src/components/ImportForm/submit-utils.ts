import { ApplicationKind, ImportSecret } from '../../types';
import {
  createApplication,
  createComponent,
  createImageRepository,
  createSecret,
} from '../../utils/create-utils';
import {
  EC_INTEGRATION_TEST_URL,
  EC_INTEGRATION_TEST_REVISION,
  EC_INTEGRATION_TEST_PATH,
} from '../IntegrationTest/IntegrationTestForm/const';
import { IntegrationTestFormValues } from '../IntegrationTest/IntegrationTestForm/types';
import { createIntegrationTest } from '../IntegrationTest/IntegrationTestForm/utils/create-utils';
import { ImportFormValues } from './type';

const BUILD_PIPELINE_ANNOTATION = 'build.appstudio.openshift.io/pipeline';

export const createSecrets = async (
  secrets: ImportSecret[],
  workspace: string,
  namespace: string,
  dryRun: boolean,
) => {
  const results = [];
  for (const secret of secrets) {
    const sec = await createSecret(secret, workspace, namespace, dryRun);
    results.push(sec);
  }
  return results;
};

export const createResources = async (
  formValues: ImportFormValues,
  namespace: string,
  workspace: string,
  bombinoUrl: string,
) => {
  const {
    source,
    application,
    componentName,
    gitProviderAnnotation,
    gitURLAnnotation,
    inAppContext,
    importSecrets = [],
    pipeline,
    showComponent,
    isPrivateRepo,
  } = formValues;
  const shouldCreateApplication = !inAppContext;
  let applicationName = application;
  const componentAnnotations: { [key: string]: string } = {
    [BUILD_PIPELINE_ANNOTATION]: JSON.stringify({ name: pipeline, bundle: 'latest' }),
  };

  const integrationTestValues: IntegrationTestFormValues = {
    name: `${applicationName}-enterprise-contract`,
    url: EC_INTEGRATION_TEST_URL,
    revision: EC_INTEGRATION_TEST_REVISION,
    path: EC_INTEGRATION_TEST_PATH,
    optional: false,
  };

  if (shouldCreateApplication) {
    await createApplication(application, namespace, true);
    await createIntegrationTest(integrationTestValues, applicationName, namespace, true);
  }
  if (showComponent) {
    await createComponent(
      { componentName, application, source, gitProviderAnnotation, gitURLAnnotation },
      applicationName,
      namespace,
      '',
      true,
      undefined,
      'create',
      undefined,
      componentAnnotations,
    );
    await createImageRepository(
      { application, component: componentName, namespace, isPrivate: isPrivateRepo, bombinoUrl },
      true,
    );
  }

  let applicationData: ApplicationKind;
  if (shouldCreateApplication) {
    applicationData = await createApplication(application, namespace);
    applicationName = applicationData.metadata.name;
    await createIntegrationTest(integrationTestValues, applicationName, namespace);
  }

  let createdComponent;
  if (showComponent) {
    const secretsToCreate = importSecrets.filter((secret) =>
      secret.existingSecrets.find((existing) => secret.secretName === existing.name) ? false : true,
    );
    await createSecrets(secretsToCreate, workspace, namespace, true);

    createdComponent = await createComponent(
      { componentName, application, gitProviderAnnotation, source, gitURLAnnotation },
      applicationName,
      namespace,
      '',
      false,
      undefined,
      'create',
      undefined,
      componentAnnotations,
    );
    await createImageRepository({
      application,
      component: componentName,
      namespace,
      isPrivate: isPrivateRepo,
      bombinoUrl,
    });
    await createSecrets(secretsToCreate, workspace, namespace, false);
  }

  return {
    applicationName,
    application: applicationData,
    component: createdComponent,
  };
};
