import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { routerRenderer } from '../../../utils/test-utils';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';

jest.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(() => [{}, jest.fn()]),
}));

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: jest.fn(() => ({ pathname: '' })),
  };
});

const useLocationMock = useLocation as jest.Mock;

const renderWithContext = (values) =>
  routerRenderer(
    <WorkspaceContext.Provider value={values}>
      <WorkspaceSwitcher />
    </WorkspaceContext.Provider>,
  );

describe('WorkspaceSwitcher', () => {
  it('should not render switcher when there are no workspaces', () => {
    renderWithContext({ workspaces: [] });
    expect(screen.queryByText('workspace')).not.toBeInTheDocument();
  });

  it('should render workspace switcher component', () => {
    renderWithContext({
      workspaces: [
        { metadata: { name: 'test-ws' } },
        { metadata: { name: 'test-ws-1' } },
        { metadata: { name: 'test-ws-2' } },
      ],
      workspace: 'test-ws',
    });
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter workspace by name')).toBeVisible();
    expect(screen.getByText('Recent')).toBeVisible();
    expect(screen.getByText('All')).toBeVisible();
  });

  it('should show currently selected item', () => {
    renderWithContext({
      workspaces: [
        { metadata: { name: 'test-ws' } },
        { metadata: { name: 'test-ws-1' } },
        { metadata: { name: 'test-ws-2' } },
      ],
      workspace: 'test-ws',
    });
    act(() => screen.getByRole('button').click());

    const selectedItem = screen.queryAllByRole('menuitem')[0];
    expect(selectedItem).toBeVisible();
    expect(selectedItem).toHaveClass('pf-m-selected');
  });

  it('should navigate to the selected workspace', () => {
    useLocationMock.mockReturnValue({
      pathname: '/application-pipeline/workspaces/test-ws/applications',
    });
    renderWithContext({
      workspaces: [
        { metadata: { name: 'test-ws' } },
        { metadata: { name: 'test-ws-1' } },
        { metadata: { name: 'test-ws-2' } },
      ],
      workspace: 'test-ws',
    });
    act(() => screen.getByRole('button').click());

    expect(screen.getByText('test-ws-1')).toBeVisible();
    act(() => screen.getByText('test-ws-1').click());
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws-1/applications',
    );
    expect(screen.queryByText('test-ws-1')).toBeNull();
  });

  it('should remove secondary path params on switch', () => {
    useLocationMock.mockReturnValue({
      pathname: '/application-pipeline/workspaces/test-ws/applications/my-app/snapshots/test-snap',
    });
    renderWithContext({
      workspaces: [
        { metadata: { name: 'test-ws' } },
        { metadata: { name: 'test-ws-1' } },
        { metadata: { name: 'test-ws-2' } },
      ],
      workspace: 'test-ws',
    });
    act(() => screen.getByRole('button').click());

    act(() => screen.getByText('test-ws-1').click());
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws-1/applications',
    );
  });
});
