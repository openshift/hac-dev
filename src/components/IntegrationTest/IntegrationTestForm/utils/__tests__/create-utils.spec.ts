import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioModel } from '../../../../../models';
import { MockIntegrationTestsWithGit } from '../../../IntegrationTestsListView/__data__/mock-integration-tests';
import { IntegrationTestLabels } from '../../types';
import {
  ResolverRefParams,
  createIntegrationTest,
  getLabelForParam,
  getURLForParam,
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
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).not.toBeDefined();
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
      },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).not.toBeDefined();
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
});
