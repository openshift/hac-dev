import * as React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { WorkspaceContext } from '../../../utils/workspace-context-utils';
import { mockKonfluxWorkspaces } from '../__data__/mock-workspace-data';
import { ChangeVisibilityModal } from '../ChangeVisibilityModal';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

const mockUpdateVisibility = jest.fn();

describe('ChangeVisibilityModal', () => {
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

  it('should fire visibility change', async () => {
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
    });
  });
});
