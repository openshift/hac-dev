import { createApplication, createComponent } from '../../../../utils/create-utils';
import { createIntegrationTest } from '../../../IntegrationTest/IntegrationTestForm/utils/create-utils';
import { detectComponents } from '../cdq-utils';
import { createResources, checkApplicationName } from '../submit-utils';
import { ImportFormValues, ImportStrategy } from './../types';

jest.mock('@redhat-cloud-services/frontend-components-notifications/redux');

jest.mock('../../../../utils/create-utils', () => ({
  ...(jest.requireActual('../../../../utils/create-utils') as object),
  createApplication: jest.fn(),
  createComponent: jest.fn(),
}));

jest.mock('../../../IntegrationTest/IntegrationTestForm/utils/create-utils', () => ({
  createIntegrationTest: jest.fn(),
}));

jest.mock('../cdq-utils', () => ({
  detectComponents: jest.fn(),
}));

const createApplicationMock = createApplication as jest.Mock;
const createComponentMock = createComponent as jest.Mock;
const detectComponentsMock = detectComponents as jest.Mock;
const createIntegrationTestMock = createIntegrationTest as jest.Mock;

describe('Submit Utils: createResources', () => {
  it('should create application and components', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
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
        selectedComponents: [true],
        namespace: 'test-ns',
        source: {
          git: {
            url: 'https://github.com/example/repo',
          },
        },
      },
      ImportStrategy.GIT,
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(2);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(2);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should only create components that are selected', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
        application: 'test-app',
        components: [
          {
            componentStub: {
              application: 'test-app',
              componentName: 'comp1',
              source: { git: { url: 'example.com' } },
            },
          },
          {
            componentStub: {
              application: 'test-app',
              componentName: 'comp2',
              source: { git: { url: 'example.com' } },
            },
          },
        ],
        selectedComponents: [false, true],
        namespace: 'test-ns',
        source: {
          git: {
            url: 'https://github.com/example/repo',
          },
        },
      },
      ImportStrategy.GIT,
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(2);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(2);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should only create components if application exists', async () => {
    await createResources(
      {
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
        selectedComponents: [true],
        namespace: 'test-ns',
        source: {
          git: {
            url: 'https://github.com/example/repo',
          },
        },
      },
      ImportStrategy.GIT,
      'test-ws',
    );
    expect(createApplicationMock).toHaveBeenCalledTimes(0);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(0);
    expect(createComponentMock).toHaveBeenCalledTimes(2);
  });

  it('should not create any resources if application dry run fails', async () => {
    createApplicationMock.mockRejectedValue(new Error('App already exists!'));
    expect(
      createResources(
        {
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
          selectedComponents: [true],
          namespace: 'test-ns',
          source: {
            git: {
              url: 'https://github.com/example/repo',
            },
          },
        },
        ImportStrategy.GIT,
        'test-ws',
      ),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith('test-app', 'test-ns', true);
    expect(createComponentMock).toHaveBeenCalledTimes(0);
    expect(createIntegrationTestMock).toHaveBeenCalledTimes(0);
  });

  it('should not create any resources if component dry run fails', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    createComponentMock.mockRejectedValue(new Error('Component already exists!'));
    expect(
      createResources(
        {
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
          selectedComponents: [true],
          namespace: 'test-ns',
          source: {
            git: {
              url: 'https://github.com/example/repo',
            },
          },
        },
        ImportStrategy.GIT,
        'test-ws',
      ),
    ).rejects.toThrow();
    expect(createApplicationMock).toHaveBeenLastCalledWith('test-app', 'test-ns', true);
  });

  it('should detect components first for sample flow', async () => {
    createApplicationMock.mockResolvedValue({ metadata: { name: 'test-app' } });
    detectComponentsMock.mockResolvedValue({ node: { componentStub: {} } });
    createComponentMock.mockResolvedValue({ metadata: { name: 'test-component' } });
    await createResources(
      {
        application: 'test-app',
        inAppContext: true,
        namespace: 'test-ns',
        source: {
          git: {
            url: 'https://github.com/example/repo',
            context: '/',
            revision: 'main',
          },
        },
      },
      ImportStrategy.SAMPLE,
      'test-ws',
    );
    expect(detectComponentsMock).toHaveBeenCalledWith(
      'https://github.com/example/repo',
      'test-ns',
      undefined,
      '/',
      'main',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Submit Utils: checkApplicationName', () => {
  const mockValues = {
    application: 'test-app',
    namespace: 'test-ns',
  } as ImportFormValues;

  const mockHelpers = {
    setStatus: jest.fn(),
  } as any;

  it('should not set any error if application can be created', async () => {
    createApplicationMock.mockResolvedValue({ message: 'Application can be created!' });
    await checkApplicationName(mockValues, mockHelpers);
    expect(mockHelpers.setStatus).toHaveBeenCalledWith({});
  });

  it('should set specific error message if application name already exists', async () => {
    createApplicationMock.mockRejectedValue({ code: 409, message: 'App already exist!' });
    try {
      await checkApplicationName(mockValues, mockHelpers);
    } catch (error) {
      expect(error.message).toEqual('App already exist!');
    }
    expect(mockHelpers.setStatus).toHaveBeenCalledWith({
      submitError: 'Application name already exists.',
    });
  });

  it('should set passed error message if some other error happens', async () => {
    createApplicationMock.mockRejectedValue({ code: 500, message: 'Server error!' });
    try {
      await checkApplicationName(mockValues, mockHelpers);
    } catch (error) {
      expect(error.message).toEqual('Server error!');
    }
    expect(mockHelpers.setStatus).toHaveBeenCalledWith({
      submitError: 'Server error!',
    });
  });
});
