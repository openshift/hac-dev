import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { FormikHelpers } from 'formik';
import { sanitizeName } from '../../../utils/create-utils';
import {
  IntegrationTestScenarioGroupVersionKind,
  IntegrationTestScenarioModel,
} from '../../models/hacbs';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import {
  FormValues,
  IntegrationTestAnnotations,
  IntegrationTestFormValues,
  IntegrationTestLabels,
} from './types';

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
      ...(optional && { labels: { [IntegrationTestLabels.OPTIONAL]: optional.toString() } }),
      annotations: {
        [IntegrationTestAnnotations.DISPLAY_NAME]: displayName,
      },
    },
    spec: {
      application,
      bundle,
      pipeline,
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
