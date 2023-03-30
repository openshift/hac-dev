import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { MockIntegrationTests } from '../../components/IntegrationTest/IntegrationTestsListView/__data__/mock-integration-tests';
import { useAccessReviewForModels } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import EditIntegrationTestPage from '../EditIntegrationTestPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    useParams: jest.fn(),
  };
});

jest.mock('react', () => ({
  ...(jest as any).requireActual('react'),
  useContext: jest.fn(() => ({ namespace: 'test-ns', workspacesLoaded: true })),
}));

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModels: jest.fn(),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));
jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));
const accessReviewMock = useAccessReviewForModels as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useParamsMock = useParams as jest.Mock;
const useWorkspaceInfoMock = useWorkspaceInfo as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('EditIntegrationTestPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ name: 'int-test' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([[], false, null]);
    render(<EditIntegrationTestPage />);
    screen.getByTestId('spinner');
  });

  it('should show error state if test cannot be loaded', () => {
    watchResourceMock.mockReturnValue([[], false, { message: 'Test does not exist', code: 404 }]);
    render(<EditIntegrationTestPage />);
    screen.getByText('404: Page not found');
  });

  it('should render no access state', () => {
    watchResourceMock.mockReturnValue([MockIntegrationTests[0], true]);
    accessReviewMock.mockReturnValue([false, true]);

    render(<EditIntegrationTestPage />);
    screen.getByTestId('no-access-state');
  });

  it('should not watch the test resource if the namespace is not set', () => {
    useWorkspaceInfoMock.mockReturnValue({ namespace: '' });
    accessReviewMock.mockReturnValue([false, true]);

    render(<EditIntegrationTestPage />);

    expect(watchResourceMock).toHaveBeenCalledWith(null);
  });
});
