import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import { ChangeVisibilityModal } from '../ChangeVisibilityModal';
import { mockKonfluxWorkspaces } from '../mock-workspace-data';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

const mockUpdateVisibility = jest.fn();
const useNavigateMock = useNavigate as jest.Mock;

describe('ChangeVisibilityModal', () => {
  let navigateMock: jest.Mock;
  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  it('should show change visibility modal', async () => {
    render(
      <ChangeVisibilityModal
        workspace={mockKonfluxWorkspaces[0]}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
    );

    await waitFor(() => {
      screen.getByTestId('change-visibility-modal');
    });
  });
  it('should show current visibility as private', async () => {
    render(
      <ChangeVisibilityModal
        workspace={mockKonfluxWorkspaces[0]}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
    );
    await waitFor(() => {
      expect((screen.getByTestId('visibility-switch') as HTMLInputElement).checked).toBe(false);
    });
  });

  it('should disable update button till visibility changes', async () => {
    render(
      <ChangeVisibilityModal
        workspace={mockKonfluxWorkspaces[0]}
        modalProps={{ isOpen: true, onClose: jest.fn() }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Update/ }) as HTMLButtonElement).toBeDisabled();
    });
  });

  it('should enable Update button when visibility switch is clicked', async () => {
    render(
      <WorkspaceContext.Provider
        value={{
          namespace: 'test-ns',
          lastUsedWorkspace: 'test-ws',
          workspace: 'test-ws',
          workspaceResource: undefined,
          workspacesLoaded: true,
          kubesawWorkspaces: [],
          konfluxWorkspaces: [],
          updateWorkspace: jest.fn(),
          updateVisibility: mockUpdateVisibility,
        }}
      >
        <ChangeVisibilityModal
          workspace={mockKonfluxWorkspaces[0]}
          modalProps={{ isOpen: true, onClose: jest.fn() }}
        />
        ,
      </WorkspaceContext.Provider>,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('visibility-switch'));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Update/ }) as HTMLButtonElement,
      ).not.toBeDisabled();
    });
  });

  it('should fire visibility change and navigate', async () => {
    render(
      <WorkspaceContext.Provider
        value={{
          namespace: 'test-ns',
          lastUsedWorkspace: 'test-ws',
          workspace: 'test-ws',
          workspaceResource: undefined,
          workspacesLoaded: true,
          kubesawWorkspaces: [],
          konfluxWorkspaces: [],
          updateWorkspace: jest.fn(),
          updateVisibility: mockUpdateVisibility,
        }}
      >
        <ChangeVisibilityModal
          workspace={mockKonfluxWorkspaces[0]}
          modalProps={{ isOpen: true, onClose: jest.fn() }}
        />
        ,
      </WorkspaceContext.Provider>,
    );

    act(() => {
      fireEvent.click(screen.getByTestId('visibility-switch'));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Update/ }));
      expect(mockUpdateVisibility).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalled();
    });
  });
});
