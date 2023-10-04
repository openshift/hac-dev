import { k8sCreateResource, k8sUpdateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { FormikHelpers } from 'formik';
import {
  IntegrationTestScenarioGroupVersionKind,
  IntegrationTestScenarioModel,
} from '../../../../models';
import {
  IntegrationTestScenarioKind,
  Param,
  ResolverParam,
  ResolverType,
} from '../../../../types/coreBuildService';
import {
  ENVIRONMENTS,
  FormValues,
  IntegrationTestFormValues,
  IntegrationTestLabels,
} from '../types';

export enum ResolverRefParams {
  URL = 'url',
  PATH = 'pathInRepo',
  REVISION = 'revision',
}

export const formatParams = (params): Param[] => {
  if (!params || !Array.isArray(params) || params.length === 0) return null;
  const newParams = [];
  params.forEach((param) => {
    const formattedValues = param.values?.filter((v) => !!v);
    if (formattedValues?.length === 1) {
      newParams.push({ name: param.name, value: formattedValues[0] });
    } else {
      newParams.push({ name: param.name, values: formattedValues });
    }
  });

  return newParams.length > 0 ? newParams : null;
};

export const editIntegrationTest = (
  integrationTest: IntegrationTestScenarioKind,
  integrationTestValues: IntegrationTestFormValues,
  dryRun?: boolean,
): Promise<IntegrationTestScenarioKind> => {
  const { url, revision, path, optional, environmentName, environmentType, params } =
    integrationTestValues;
  const integrationTestResource: IntegrationTestScenarioKind = {
    ...integrationTest,
    metadata: {
      ...integrationTest.metadata,
      labels: { [IntegrationTestLabels.OPTIONAL]: optional.toString() },
    },
    spec: {
      ...integrationTest.spec,
      environment:
        environmentType && environmentName !== ENVIRONMENTS.DEFAULT
          ? {
              name: environmentName,
              type: environmentType,
              configuration: {
                env: [],
              },
            }
          : null,
      resolverRef: {
        resolver: ResolverType.GIT,
        params: [
          { name: ResolverRefParams.URL, value: url },
          { name: ResolverRefParams.REVISION, value: revision },
          { name: ResolverRefParams.PATH, value: path },
        ],
      },
      params: formatParams(params),
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
  const { name, url, revision, path, optional, environmentName, environmentType, params } =
    integrationTestValues;
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
      environment:
        environmentType && environmentName !== ENVIRONMENTS.DEFAULT
          ? {
              name: environmentName,
              type: environmentType,
              configuration: {
                env: [],
              },
            }
          : null,
      resolverRef: {
        resolver: ResolverType.GIT,
        params: [
          { name: ResolverRefParams.URL, value: url },
          { name: ResolverRefParams.REVISION, value: revision },
          { name: ResolverRefParams.PATH, value: path },
        ],
      },
      params: formatParams(params),
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

const getGitHubLink = (url: string): string => {
  const httpURL = url ? (/(http(s?)):\/\//i.test(url) ? url : `https://${url}`) : null;
  const gitIndex = httpURL?.indexOf('.git');
  return gitIndex > 1 ? httpURL.substring(0, gitIndex) : httpURL;
};

export const getURLForParam = (params: ResolverParam[], paramName: string): string => {
  const url = params.find((param) => param.name === ResolverRefParams.URL);

  const resolverParam =
    paramName === ResolverRefParams.URL ? url : params.find((param) => param.name === paramName);

  const checkedURL = getGitHubLink(url?.value);

  if (paramName === ResolverRefParams.URL) {
    return checkedURL;
  }
  if (paramName === ResolverRefParams.PATH && resolverParam) {
    const branch = params.find((param) => param.name === ResolverRefParams.REVISION);
    return `${checkedURL}/tree/${branch.value}/${resolverParam.value}`;
  }
  if (paramName === ResolverRefParams.REVISION && resolverParam) {
    return `${checkedURL}/tree/${resolverParam.value}`;
  }
  return null;
};

export const getLabelForParam = (paramName: string): string => {
  if (paramName === ResolverRefParams.URL) {
    return 'GitHub URL';
  }
  if (paramName === ResolverRefParams.PATH) {
    return 'Path in repository';
  }
  return `${paramName.charAt(0).toUpperCase()}${paramName.slice(1)}`;
};
