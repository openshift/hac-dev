import { createApplication, createComponent } from '../../../../utils/create-utils';
import { createResources } from '../submit-utils';

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux');

jest.mock('../../../../utils/create-utils', () => ({
  createApplication: jest.fn(),
  createComponent: jest.fn(),
}));

const createApplicationMock = createApplication as jest.Mock;
const createComponentMock = createComponent as jest.Mock;

describe('Submit Utils: createResources', () => {
  it('should create application and components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    await createResources({
      application: 'test-app',
      components: [
        {
          componentStub: {
            application: 'test-app',
            componentName: 'comp',
            source: { git: { url: 'example.com' } },
          },
        },
      ],
      namespace: 'test-ns',
      source: 'https://github.com/example/repo',
    });
    expect(createApplicationMock).toHaveBeenCalledTimes(2);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should only create components if application exists', async () => {
    await createResources({
      application: 'test-app',
      inAppContext: true,
      components: [
        {
          componentStub: {
            application: 'test-app',
            componentName: 'comp',
            source: { git: { url: 'example.com' } },
          },
        },
      ],
      namespace: 'test-ns',
      source: 'https://github.com/example/repo',
    });
    expect(createApplicationMock).toHaveBeenCalledTimes(0);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should not create any resources if application dry run fails', async () => {
    createApplicationMock.mockRejectedValue(new Error('App already exists!'));
    expect(
      createResources({
        application: 'test-app',
        components: [
          {
            componentStub: {
              application: 'test-app',
              componentName: 'comp',
              source: { git: { url: 'example.com' } },
            },
          },
        ],
        namespace: 'test-ns',
        source: 'https://github.com/example/repo',
      }),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith('test-app', 'test-ns', true);
    expect(createComponentMock).toHaveBeenCalledTimes(0);
  });

  it('should not create any resources if component dry run fails', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockRejectedValue(new Error('Component already exists!'));
    expect(
      createResources({
        application: 'test-app',
        components: [
          {
            componentStub: {
              application: 'test-app',
              componentName: 'comp',
              source: { git: { url: 'example.com' } },
            },
          },
        ],
        namespace: 'test-ns',
        source: 'https://github.com/example/repo',
      }),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith('test-app', 'test-ns', true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
