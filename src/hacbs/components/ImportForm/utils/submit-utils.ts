import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { FormikHelpers } from 'formik';
import { createComponents } from '../../../../components/ImportForm/utils/submit-utils';
import { ImportFormValues } from '../../../../components/ImportForm/utils/types';
import { createApplication, sanitizeName } from '../../../../utils/create-utils';
import {
  IntegrationTestScenarioGroupVersionKind,
  IntegrationTestScenarioModel,
} from '../../../models';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { FormValues, IntegrationTestFormValues } from '../types';

export const onComponentsSubmit = async (
  { inAppContext, application, components, applicationData, namespace, secret }: FormValues,
  formikBag: FormikHelpers<ImportFormValues>,
) => {
  const applicationName = inAppContext ? application : applicationData.metadata.name;
  try {
    await createComponents(components, applicationName, namespace, secret, false, true);
  } catch (error) {
    const message = error.code === 409 ? 'Component name already exists' : error.message;
    const errorComponent = error.json.details.name;
    const errorComponentIndex = components.findIndex(
      (c) => c.componentStub.componentName === errorComponent,
    );
    if (errorComponentIndex >= 0) {
      formikBag.setFieldError(
        `components[${errorComponentIndex}].componentStub.componentName`,
        message,
      );
    }
    throw error;
  }
};

export const onApplicationSubmit = async (
  { application, namespace }: FormValues,
  formikBag: FormikHelpers<ImportFormValues>,
) => {
  try {
    await createApplication(application, namespace, true);
    const applicationData = await createApplication(application, namespace, false);
    formikBag.setFieldValue('applicationData', applicationData);
    return applicationData;
  } catch (error) {
    const message = error.code === 409 ? 'Application name already exists.' : error.message;
    formikBag.setFieldError('application', message);
    throw error;
  }
};

export enum IntegrationTestAnnotations {
  DISPLAY_NAME = 'app.kubernetes.io/display-name',
}

// /**
//  * Create integrationTestScenario CR
//  *
//  * @param integrationTest integration test data
//  * @param application application name
//  * @param namespace namespace of the application
//  * @param dryRun dry run without creating any resources
//  * @returns Returns IntegrationTestScenario CR data
//  *
//  */
export const createIntegrationTest = (
  integrationTest: IntegrationTestFormValues,
  application: string,
  namespace: string,
  dryRun?: boolean,
): Promise<IntegrationTestScenarioKind> => {
  const { name: displayName, bundle, pipeline, optional } = integrationTest;
  const name = sanitizeName(displayName);
  const integrationTestResource: IntegrationTestScenarioKind = {
    apiVersion: `${IntegrationTestScenarioGroupVersionKind.group}/${IntegrationTestScenarioGroupVersionKind.version}`,
    kind: IntegrationTestScenarioGroupVersionKind.kind,
    metadata: {
      name,
      namespace,
      annotations: {
        [IntegrationTestAnnotations.DISPLAY_NAME]: displayName,
      },
    },
    spec: {
      application,
      bundle,
      pipeline,
      optional,
      contexts: [
        {
          description: 'Application testing',
          name: 'application',
        },
      ],
    },
  };

  return k8sCreateResource({
    model: IntegrationTestScenarioModel,
    queryOptions: {
      name,
      ns: namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: integrationTestResource,
  });
};

export const createAppIntegrationTest = async (
  { application, inAppContext, integrationTest, applicationData, namespace }: FormValues,
  formHelpers: FormikHelpers<FormValues>,
) => {
  const appName = inAppContext ? application : applicationData?.metadata?.name;
  try {
    await createIntegrationTest(integrationTest, appName, namespace, false);
  } catch (e) {
    if (e.code === 409) {
      formHelpers.setFieldError('integrationTest.name', 'Integration test name already exists');
    }
    throw e;
  }
};
