import { ImportFormValues } from '../../../../../components/ImportForm/utils/types';
import { createApplication, createComponent } from '../../../../../utils/create-utils';
import { FormValues } from '../../types';
import { onApplicationSubmit, onComponentsSubmit } from '../submit-utils';
import { mockApplication } from './application-data';

jest.mock('../../../../../utils/create-utils', () => ({
  createApplication: jest.fn(),
  createComponent: jest.fn(),
}));

const createApplicationMock = createApplication as jest.Mock;
const createComponentMock = createComponent as jest.Mock;

const mockHelpers = {
  setStatus: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldError: jest.fn(),
} as any;

afterEach(() => {
  jest.clearAllMocks();
});
describe('Submit Utils', () => {
  describe('onApplicationSubmit', () => {
    it('should throw application name already exists error', async () => {
      createApplicationMock.mockRejectedValue({
        code: 409,
        message: '"test-application" already exists!',
      });
      try {
        await onApplicationSubmit(
          { application: 'test-application', namespace: 'test-ns' } as ImportFormValues,
          mockHelpers,
        );
      } catch (e) {
        expect(mockHelpers.setFieldError).toHaveBeenCalledWith(
          'application',
          'Application name already exists.',
        );
        expect(createApplicationMock).toHaveBeenCalledTimes(1);
        expect(createApplicationMock).toHaveBeenLastCalledWith(
          'test-application',
          'test-ns',
          true, // dryRun
        );
      }
    });

    it('should throw same message from api response', async () => {
      createApplicationMock.mockRejectedValue({ code: 400, message: 'Bad request' });
      try {
        await onApplicationSubmit(
          { application: 'test-application', namespace: 'test-ns' } as ImportFormValues,
          mockHelpers,
        );
      } catch (e) {
        expect(mockHelpers.setFieldError).toHaveBeenCalledWith('application', 'Bad request');
        expect(createApplicationMock).toHaveBeenCalledTimes(1);
        expect(createApplicationMock).toHaveBeenLastCalledWith(
          'test-application',
          'test-ns',
          true, // dryRun
        );
      }
    });

    it('should create the application', async () => {
      createApplicationMock.mockResolvedValue(mockApplication);
      try {
        await onApplicationSubmit(
          { application: 'test-application', namespace: 'test-ns' } as ImportFormValues,
          mockHelpers,
        );
      } catch (e) {
        expect(mockHelpers.setFieldError).toHaveBeenCalledWith('application', 'Bad request');
      }
      expect(mockHelpers.setFieldValue).toHaveBeenCalledWith('applicationData', mockApplication);
      expect(createApplicationMock).toHaveBeenCalledTimes(2);
      expect(createApplicationMock).toHaveBeenLastCalledWith(
        'test-application',
        'test-ns',
        false, // dryRun
      );
    });
  });

  describe('onComponentsSubmit', () => {
    const mockComponent = {
      applicationData: { metadata: { name: 'test-app' } },
      components: [
        {
          componentStub: {
            application: 'test-app',
            componentName: 'nodejs',
            replicas: 1,
            targetPort: 3000,
            source: { git: { url: 'example.com' } },
          },
        },
      ],
      namespace: 'test-ns',
      secret: 'my-secret',
    } as FormValues;

    it('should throw component name already exists error', async () => {
      createComponentMock.mockRejectedValue({
        code: 409,
        message: '"nodejs" already exists!',
      });
      try {
        await onComponentsSubmit(mockComponent, mockHelpers);
      } catch (e) {
        expect(mockHelpers.setStatus).toHaveBeenCalledWith({
          submitError: 'Component name already exists.',
        });
      }
    });

    it('should throw same message from api response', async () => {
      createComponentMock.mockRejectedValue({ code: 400, message: 'Bad request' });
      try {
        await onComponentsSubmit(mockComponent, mockHelpers);
      } catch (e) {
        expect(mockHelpers.setStatus).toHaveBeenCalledWith({
          submitError: 'Bad request',
        });
      }
    });

    it('should create the component', async () => {
      createComponentMock.mockResolvedValue(mockApplication);
      await onComponentsSubmit(mockComponent, mockHelpers);

      expect(createComponentMock).toHaveBeenLastCalledWith(
        {
          application: 'test-app',
          componentName: 'nodejs',
          replicas: 1,
          resources: undefined,
          source: { git: { url: 'example.com' } },
          targetPort: 3000,
        },
        'test-app',
        'test-ns',
        'my-secret',
        false, // dryRun
      );
    });
  });
});
