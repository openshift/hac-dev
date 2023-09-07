import * as React from 'react';
import { useParams } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { useAccessReviewForModels } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import EditAccessPage from '../EditAccessPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

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

describe('EditAccessPage', () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({ name: 'test-sbr' });
    accessReviewMock.mockReturnValue([true, true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([true, false]);
    watchResourceMock.mockReturnValue([{}, false, null]);
    render(<EditAccessPage />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should show error state if sbr cannot be loaded', () => {
    watchResourceMock.mockReturnValue([{}, false, { message: 'SBR does not exist', code: 404 }]);
    render(<EditAccessPage />);
    expect(screen.getByText('404: Page not found')).toBeVisible();
  });

  it('should render no access state', () => {
    accessReviewMock.mockReturnValue([false, true]);
    watchResourceMock.mockReturnValue([{}, true]);

    render(<EditAccessPage />);
    expect(screen.getByTestId('no-access-state')).toBeVisible();
  });

  it('should not watch the sbr resource if the namespace is not set', () => {
    useWorkspaceInfoMock.mockReturnValue({ namespace: '' });
    watchResourceMock.mockReturnValue([{}, false, null]);
    accessReviewMock.mockReturnValue([false, true]);

    render(<EditAccessPage />);

    expect(watchResourceMock).toHaveBeenCalledWith(null);
  });
});
