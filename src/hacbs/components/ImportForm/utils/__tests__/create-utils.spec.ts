import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { IntegrationTestScenarioModel } from '../../../../models/hacbs';
import { createIntegrationTest, IntegrationTestAnnotations } from '../../create-utils';

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
    annotations: {
      'app.kubernetes.io/display-name': 'app test',
    },
  },
  spec: {
    application: 'Test Application',
    optional: false,
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
      { name: 'app test', bundle: '', pipeline: '', optional: false },
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

  it('Should contain the display name in the annotations', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      { name: 'app test', bundle: '', pipeline: '', optional: false },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.annotations).toBeDefined();
    expect(resource.metadata.annotations[IntegrationTestAnnotations.DISPLAY_NAME]).toBe('app test');
  });

  it('Should contain kubernetes formatted resource name', async () => {
    createResourceMock.mockImplementation(({ resource }) => resource);
    const resource = await createIntegrationTest(
      { name: 'APPLICATION TESTING', bundle: '', pipeline: '', optional: false },
      'Test Application',
      'test-ns',
    );
    expect(resource.metadata.name).toBe('application-testing');
  });
});
