import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render, screen } from '@testing-library/react';
import { useAccessReviewForModel, useAccessReviewForModels } from '../../utils/rbac';
import { useWorkspaceInfo, WorkspaceContext } from '../../utils/workspace-context-utils';
import UserAccessPage from '../UserAccessPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useSearchParams: () => React.useState(() => new URLSearchParams()),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(() => ({ name: 'test-sbr' })),
}));

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useContext: jest.fn((ctx) =>
      ctx === WorkspaceContext
        ? { namespace: 'test-ns', workspaces: [], workspacesLoaded: true }
        : actual.useContext(ctx),
    ),
  };
});

jest.mock('../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(),
  useAccessReviewForModels: jest.fn(() => [true, true]),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

const accessReviewMock = useAccessReviewForModel as jest.Mock;
const accessReviewsMock = useAccessReviewForModels as jest.Mock;
const watchResourceMock = useK8sWatchResource as jest.Mock;
const useWorkspaceInfoMock = useWorkspaceInfo as jest.Mock;

describe('UserAccessPage', () => {
  beforeEach(() => {
    watchResourceMock.mockReturnValue([[], false]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when access check is not loaded', () => {
    accessReviewMock.mockReturnValue([false, false]);
    render(<UserAccessPage />);
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should render no access state', () => {
    accessReviewsMock.mockReturnValue([false, true]);

    render(<UserAccessPage />);
    expect(screen.getByTestId('no-access-state')).toBeVisible();
  });

  it('should not watch the sbr resource if the namespace is not set', () => {
    useWorkspaceInfoMock.mockReturnValue({ namespace: '' });

    render(<UserAccessPage />);

    expect(watchResourceMock).not.toHaveBeenCalled();
  });
});
