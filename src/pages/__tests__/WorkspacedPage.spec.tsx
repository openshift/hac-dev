import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import WorkspacedPage from '../WorkspacedPage';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => () => {},
    useParams: jest.fn(),
    useLocation: jest.fn(),
    Navigate: ({ to }) => <p role="navigate">{to}</p>,
  };
});

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(),
}));

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useContext: jest.fn(),
  };
});

const mockUseParams = useParams as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;
const mockUseWorkspaceInfo = useWorkspaceInfo as jest.Mock;
const mockUseContext = React.useContext as jest.Mock;
const getMockPathname = () => `/application-pipeline`;

describe('WorkspacedPage', () => {
  it('should redirect user to a url', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname() });
    mockUseParams.mockReturnValue({
      workspaceName: 'mock-workspace',
    });
    mockUseWorkspaceInfo.mockReturnValue({ workspace: 'mock-workspace' });
    mockUseContext.mockReturnValue({});
    render(<WorkspacedPage />);
    const navigate = screen.getByRole('navigate');
    expect(navigate.innerHTML).toEqual('/application-pipeline/workspaces/mock-workspace');
  });

  it('should use lastUsedWorkspace in case workspace is not found', () => {
    mockUseLocation.mockReturnValue({ pathname: getMockPathname() });
    mockUseParams.mockReturnValue({
      workspaceName: undefined,
    });
    mockUseWorkspaceInfo.mockReturnValue({ workspace: undefined });
    mockUseContext.mockReturnValue({ lastUsedWorkspace: 'mock-last-used-workspace' });
    render(<WorkspacedPage />);
    const navigate = screen.getByRole('navigate');
    expect(navigate.innerHTML).toEqual('/application-pipeline/workspaces/mock-last-used-workspace');
  });
});
