import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../utils/rbac';
import { namespaceRenderer } from '../../utils/test-utils';
import EditAccessPage from '../EditAccessPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('../../components/UserAccess/UserAccessForm/UserAccessFormPage', () => ({
  UserAccessFormPage: () => <div data-test="access-form-page" />,
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const accessReviewMock = useAccessReviewForModels as jest.Mock;

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;

describe('EditAccessPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ name: 'myuser' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([{}, false, null]);
    namespaceRenderer(<EditAccessPage />, 'test-ns', {
      workspace: 'test-ws',
      workspaceResource: {} as any,
    });
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should show the spinner when binding is found but not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([{}, false, null]);
    namespaceRenderer(<EditAccessPage />, 'test-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        status: {
          bindings: [
            {
              masterUserRecord: 'myuser',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      } as any,
    });
    expect(screen.getByTestId('spinner')).toBeVisible();
  });

  it('should show error state if binding is found but cannot be loaded', () => {
    watchResourceMock.mockReturnValue([{}, false, { message: 'SBR does not exist', code: 404 }]);
    namespaceRenderer(<EditAccessPage />, 'test-ns', {
      workspace: 'test-ws',
      workspaceResource: {
        status: {
          bindings: [
            {
              masterUserRecord: 'myuser',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      } as any,
    });
    expect(screen.getByText('404: Page not found')).toBeVisible();
  });

  it('should render no access state', () => {
    accessReviewMock.mockReturnValue([false, true]);
    watchResourceMock.mockReturnValue([{}, true]);

    namespaceRenderer(<EditAccessPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
      workspaceResource: {
        status: {
          bindings: [
            {
              masterUserRecord: 'myuser',
              bindingRequest: { name: 'test-sbr', namespace: 'test-ns' },
            },
          ],
        },
      } as any,
    });
    expect(screen.getByTestId('no-access-state')).toBeVisible();
  });

  it('should not watch the sbr resource if the namespace is not set', () => {
    watchResourceMock.mockReturnValue([{}, false, null]);
    accessReviewMock.mockReturnValue([false, true]);

    namespaceRenderer(<EditAccessPage />, '', {
      workspace: 'test-ws',
      workspaceResource: {} as any,
    });

    expect(watchResourceMock).toHaveBeenCalledWith(null);
  });

  it('should avoid looking up sbr if binding request is not found', () => {
    watchResourceMock.mockReturnValue([{}, true]);

    namespaceRenderer(<EditAccessPage />, 'test-ns', {
      workspace: 'test-ws',
      workspacesLoaded: true,
      workspaceResource: {
        status: {
          bindings: [
            {
              masterUserRecord: 'myuser',
            },
          ],
        },
      } as any,
    });
    expect(watchResourceMock).toHaveBeenCalledWith(null);
    expect(screen.getByTestId('access-form-page')).toBeVisible();
  });
});
