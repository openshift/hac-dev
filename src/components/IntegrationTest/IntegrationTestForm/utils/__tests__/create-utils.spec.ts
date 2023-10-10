import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioModel } from '../../../../../models';
import { MockIntegrationTestsWithGit } from '../../../IntegrationTestsListView/__data__/mock-integration-tests';
import {
  EC_INTEGRATION_TEST_KIND,
  EC_INTEGRATION_TEST_PATH,
  EC_INTEGRATION_TEST_REVISION,
  EC_INTEGRATION_TEST_URL,
} from '../../const';
import { IntegrationTestAnnotations, IntegrationTestLabels } from '../../types';
import {
  ResolverRefParams,
  createIntegrationTest,
  getLabelForParam,
  getURLForParam,
  formatParams,
} from '../create-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sCreateResource: jest.fn(),
}));

const createResourceMock = k8sCreateResource as jest.Mock;

const integrationTestData = {
  apiVersion: `${IntegrationTestScenarioModel.apiGroup}/${IntegrationTestScenarioModel.apiVersion}`,
  kind: IntegrationTestScenarioModel.kind,
  metadata: {
    name: 'app-test',
    namespace: 'test-ns',
  },
  spec: {
    application: 'Test Application',
    params: null,
    environment: {
      name: 'test1',
      type: 'POC',
      configuration: {
        env: [],
      },
    },
    resolverRef: {
      resolver: 'git',
      params: [
        { name: 'url', value: 'test-url' },
        { name: 'revision', value: 'test-revision' },
        { name: 'pathInRepo', value: 'test-path' },
      ],
    },
    contexts: [
      {
        description: 'Application testing',
        name: 'application',
      },
    ],
  },
};

describe('Create Utils', () => {
  it('Should call k8sCreateResource with integration test data', async () => {
    await createIntegrationTest(
      {
        name: 'app-test',
        revision: 'test-revision',
        url: 'test-url',
        path: 'test-path',
        optional: false,
        environmentName: 'test1',
        environmentType: 'POC',
      },
      'Test Application',
      'test-ns',
    );

    expect(createResourceMock).toHaveBeenCalledWith({
      model: IntegrationTestScenarioModel,
      queryOptions: {
        name: 'app-test',
        ns: 'test-ns',
      },
      resource: integrationTestData,
    });
  });

  it('Should contain the optional test value in the labels', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      {
        name: 'app-test',
        revision: 'test-revision',
        url: 'test-url',
        path: 'test-path',
        optional: true,
        environmentName: 'test1',
        environmentType: 'POC',
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).toBeDefined();
    expect(resource.metadata.labels[IntegrationTestLabels.OPTIONAL]).toBe('true');
  });

  it('Should not contain the optional label if the test is mandatory', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      {
        name: 'app-test',
        revision: 'test-revision',
        url: 'test-url',
        path: 'test-path',
        optional: false,
        environmentName: 'test1',
        environmentType: 'POC',
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).not.toBeDefined();
  });

  it('Should contain parameters with correct value', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      {
        name: 'app-test',
        revision: 'test-revision',
        url: 'test-url',
        path: 'test-path',
        optional: false,
        environmentName: 'test1',
        environmentType: 'POC',
        params: [{ name: 'param1', values: ['value'] }],
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.spec.params).toBeDefined();
    expect(resource.spec.params[0].name).toBe('param1');
    expect(resource.spec.params[0].value).toBe('value');
  });

  it('Should contain parameters with multiple values', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      {
        name: 'app-test',
        revision: 'test-revision',
        url: 'test-url',
        path: 'test-path',
        optional: false,
        environmentName: 'test1',
        environmentType: 'POC',
        params: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.spec.params).toBeDefined();
    expect(resource.spec.params[0].name).toBe('param1');
    expect(resource.spec.params[0].values).toBeDefined();
    expect(resource.spec.params[0].values.length).toBe(3);
    expect(resource.spec.params[0].values[0]).toBe('value1');
    expect(resource.spec.params[0].values[2]).toBe('value3');
  });

  it('Should return correct labels for params', () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = MockIntegrationTestsWithGit[0];
    expect(getLabelForParam(resource.spec.resolverRef.params[0].name)).toBe('GitHub URL');
    expect(getLabelForParam(resource.spec.resolverRef.params[1].name)).toBe('Revision');
    expect(getLabelForParam(resource.spec.resolverRef.params[2].name)).toBe('Path in repository');
    expect(getLabelForParam('test-param')).toBe('Test-param');
  });

  it('Should return correct link for params', () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = MockIntegrationTestsWithGit[0];
    const k8sResource = MockIntegrationTestsWithGit[2];
    expect(getURLForParam(resource.spec.resolverRef.params, ResolverRefParams.URL)).toBe(
      'https://test-url',
    );
    expect(getURLForParam(k8sResource.spec.resolverRef.params, ResolverRefParams.URL)).toBe(
      'https://github.com/redhat-appstudio/integration-examples',
    );
    expect(getURLForParam(resource.spec.resolverRef.params, ResolverRefParams.REVISION)).toBe(
      'https://test-url/tree/main',
    );
    expect(getURLForParam(k8sResource.spec.resolverRef.params, ResolverRefParams.REVISION)).toBe(
      'https://github.com/redhat-appstudio/integration-examples/tree/main',
    );
    expect(getURLForParam(resource.spec.resolverRef.params, ResolverRefParams.PATH)).toBe(
      'https://test-url/tree/main/test-path',
    );
    expect(getURLForParam(k8sResource.spec.resolverRef.params, ResolverRefParams.PATH)).toBe(
      'https://github.com/redhat-appstudio/integration-examples/tree/main/pipelines/integration_pipeline_pass.yaml',
    );
  });

  it('Should set EC kind annotation', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      {
        name: 'app-enterprise-contract',
        revision: EC_INTEGRATION_TEST_REVISION,
        url: EC_INTEGRATION_TEST_URL,
        path: EC_INTEGRATION_TEST_PATH,
        optional: false,
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.annotations).toStrictEqual({
      [IntegrationTestAnnotations.KIND]: EC_INTEGRATION_TEST_KIND,
    });
  });
});

describe('Create Utils formatParams', () => {
  it('Should render null if no params or empty array []', () => {
    const formattedParams = formatParams([]);
    expect(formattedParams).toBeNull();
  });

  it('Should render 3 params ', () => {
    const formattedParams = formatParams([
      { name: 'apple', values: ['val1', 'val2'] },
      { name: 'mango', values: ['val1', 'val2'] },
      { name: 'orange', values: ['val1', 'val2'] },
    ]);
    expect(formattedParams.length).toBe(3);
  });

  it('Should remove empty values ', () => {
    const formattedParams = formatParams([
      { name: 'apple', values: ['val1', '', ''] },
      { name: 'mango', values: ['val1', '', 'val2', ''] },
      { name: 'orange', values: ['', '', 'val1', '', 'val2'] },
    ]);
    expect(formattedParams.length).toBe(3);
    expect(formattedParams[0].value).toBe('val1');
    expect(formattedParams[1].values.length).toBe(2);
    expect(formattedParams[1].values[0]).toBe('val1');
    expect(formattedParams[1].values[1]).toBe('val2');
    expect(formattedParams[2].values.length).toBe(2);
    expect(formattedParams[2].values[0]).toBe('val1');
    expect(formattedParams[2].values[1]).toBe('val2');
  });

  it('Should convert Values to value if only 1 entry', () => {
    const formattedParams = formatParams([
      { name: 'apple', values: ['val1'] },
      { name: 'mango', values: ['val1', 'val2'] },
      { name: 'orange', values: ['val1', 'val2'] },
    ]);
    expect(formattedParams.length).toBe(3);
    expect(formattedParams[0].value).toBe('val1');
  });
});
