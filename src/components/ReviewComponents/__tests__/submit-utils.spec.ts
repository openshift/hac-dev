import { createApplication, createComponent } from '../../../utils/create-utils';
import { createResources } from '../submit-utils';

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux');

jest.mock('../../../utils/create-utils', () => ({
  createApplication: jest.fn(),
  createComponent: jest.fn(),
}));

const createApplicationMock = createApplication as jest.Mock;
const createComponentMock = createComponent as jest.Mock;

describe('createResources', () => {
  it('should create application and components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    await createResources(
      { components: [] },
      {
        comp: {
          name: 'comp',
          source: { git: { url: 'example.com' } },
        },
      },
    );
    expect(createApplicationMock).toHaveBeenCalled();
    expect(createComponentMock).toHaveBeenCalled();
  });

  it('should create component with devfileUrl if CDQ has devfileUrl', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    await createResources(
      { components: [] },
      {
        comp: {
          name: 'comp',
          source: { git: { url: 'example.com', devfileUrl: 'devfile.io/sample' } },
        },
      },
    );
    expect(createApplicationMock).toHaveBeenCalled();
    expect(createComponentMock).toHaveBeenCalledWith(
      {
        name: 'comp',
        gitRepo: 'example.com',
        devfileUrl: 'devfile.io/sample',
        replicas: undefined,
        targetPort: undefined,
        resources: undefined,
      },
      'test-app',
      undefined,
      undefined,
      undefined,
    );
  });

  it('should create component with dockerfileUrl if CDQ has dockerfileUrl', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    await createResources(
      { components: [] },
      {
        comp: {
          name: 'comp',
          source: { git: { url: 'example.com', dockerfileUrl: 'dockerfile.io/sample' } },
        },
      },
    );
    expect(createApplicationMock).toHaveBeenCalled();
    expect(createComponentMock).toHaveBeenCalledWith(
      {
        name: 'comp',
        gitRepo: 'example.com',
        dockerfileUrl: 'dockerfile.io/sample',
        replicas: undefined,
        targetPort: undefined,
        resources: undefined,
      },
      'test-app',
      undefined,
      undefined,
      undefined,
    );
  });

  it('should only create components if application exists', async () => {
    await createResources(
      { components: [], existingApplication: 'test-app' },
      {
        comp: {
          name: 'comp',
          source: { git: { url: 'example.com' } },
        },
      },
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(0);
    expect(createComponentMock).toHaveBeenCalled();
  });

  it('should not create any resources if application dry run fails', async () => {
    createApplicationMock.mockRejectedValue(new Error('App already exists!'));
    expect(
      createResources(
        { components: [] },
        {
          comp: {
            name: 'comp',
            source: { git: { url: 'example.com' } },
          },
        },
      ),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith(undefined, undefined, true);
    expect(createComponentMock).toHaveBeenCalledTimes(0);
  });

  it('should not create any resources if component dry run fails', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockRejectedValue(new Error('Component already exists!'));
    expect(
      createResources(
        { components: [] },
        {
          comp: {
            name: 'comp',
            source: { git: { url: 'example.com' } },
          },
        },
      ),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith(undefined, undefined, true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
