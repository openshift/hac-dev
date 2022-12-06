import { k8sCreateResource, k8sUpdateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { FormikHelpers } from 'formik';
import {
  IntegrationTestScenarioGroupVersionKind,
  IntegrationTestScenarioModel,
} from '../../models/hacbs';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import { FormValues, IntegrationTestFormValues, IntegrationTestLabels } from './types';

export const editIntegrationTest = (
  integrationTest: IntegrationTestScenarioKind,
  integrationTestValues: IntegrationTestFormValues,
  dryRun?: boolean,
): Promise<IntegrationTestScenarioKind> => {
  const { bundle, pipeline, optional } = integrationTestValues;
  const integrationTestResource: IntegrationTestScenarioKind = {
    ...integrationTest,
    metadata: {
      ...integrationTest.metadata,
      labels: { [IntegrationTestLabels.OPTIONAL]: optional.toString() },
    },
    spec: {
      ...integrationTest.spec,
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

  return k8sUpdateResource({
    model: IntegrationTestScenarioModel,
    queryOptions: {
      name: integrationTest.metadata.name,
      ns: integrationTest.metadata.namespace,
      ...(dryRun && { queryParams: { dryRun: 'All' } }),
    },
    resource: integrationTestResource,
  });
};

// /**
//  * Create integrationTestScenario CR
//  *
//  * @param integrationTestValues integration test data
//  * @param application application name
//  * @param namespace namespace of the application
//  * @param dryRun dry run without creating any resources
//  * @returns Returns IntegrationTestScenario CR data
//  *
//  */
export const createIntegrationTest = (
  integrationTestValues: IntegrationTestFormValues,
  application: string,
  namespace: string,
  dryRun?: boolean,
): Promise<IntegrationTestScenarioKind> => {
  const { name, bundle, pipeline, optional } = integrationTestValues;
  const integrationTestResource: IntegrationTestScenarioKind = {
    apiVersion: `${IntegrationTestScenarioGroupVersionKind.group}/${IntegrationTestScenarioGroupVersionKind.version}`,
    kind: IntegrationTestScenarioGroupVersionKind.kind,
    metadata: {
      name,
      namespace,
      ...(optional && { labels: { [IntegrationTestLabels.OPTIONAL]: optional.toString() } }),
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
