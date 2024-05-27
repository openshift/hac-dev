import { createApplication, createComponent } from '../../../utils/create-utils';
import { createIntegrationTest } from '../../IntegrationTest/IntegrationTestForm/utils/create-utils';
import { createResources } from '../submit-utils';

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux');

jest.mock('../../../utils/create-utils', () => ({
  ...(jest.requireActual('../../../utils/create-utils') as object),
  createApplication: jest.fn(),
  createComponent: jest.fn(),
}));

jest.mock('../../IntegrationTest/IntegrationTestForm/utils/create-utils', () => ({
  createIntegrationTest: jest.fn(),
}));

const createApplicationMock = createApplication as jest.Mock;
const createComponentMock = createComponent as jest.Mock;
const createIntegrationTestMock = createIntegrationTest as jest.Mock;

describe('Submit Utils: createResources', () => {
  it('should create application and components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
        application: 'test-app',
        inAppContext: false,
        showComponent: true,
        isPrivateRepo: false,
        source: {
          git: {
            url: 'https://github.com/',
          },
        },
        pipeline: 'dbcd',
        componentName: 'component',
      },
      'test-ws-tenant',
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(2);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(2);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should create application but not components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
        application: 'test-app',
        inAppContext: false,
        showComponent: false,
        isPrivateRepo: false,
        source: {
          git: {
            url: 'https://github.com/',
          },
        },
        pipeline: 'dbcd',
        componentName: 'component',
      },
      'test-ws-tenant',
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(2);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(2);
    expect(createComponentMock).toHaveBeenCalledTimes(0);
  });

  it('should not create application but create components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
        application: 'test-app',
        inAppContext: true,
        showComponent: true,
        isPrivateRepo: false,
        source: {
          git: {
            url: 'https://github.com/',
          },
        },
        pipeline: 'dbcd',
        componentName: 'component',
      },
      'test-ws-tenant',
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(0);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(0);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
