import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioModel } from '../../../../../models';
import { createIntegrationTest } from '../../create-utils';
import { IntegrationTestLabels } from '../../types';

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
    bundle: '',
    contexts: [
      {
        description: 'Application testing',
        name: 'application',
      },
    ],
    pipeline: '',
  },
};

describe('Create Utils', () => {
  it('Should call k8sCreateResource with integration test data', async () => {
    await createIntegrationTest(
      { name: 'app-test', bundle: '', pipeline: '', optional: false },
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
      { name: 'app-test', bundle: '', pipeline: '', optional: true },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).toBeDefined();
    expect(resource.metadata.labels[IntegrationTestLabels.OPTIONAL]).toBe('true');
  });

  it('Should not contain the optional label if the test is mandatory', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      { name: 'app-test', bundle: '', pipeline: '', optional: false },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.labels).not.toBeDefined();
  });
});
