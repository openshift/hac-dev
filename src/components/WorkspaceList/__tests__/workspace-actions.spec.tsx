import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { mockKonfluxWorkspaces } from '../mock-workspace-data';
import { useWorkspaceActions } from '../workspace-actions';

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../modal/ModalProvider', () => ({
  useModalLauncher: jest.fn(() => 'cta'),
}));

describe('useWorkspaceActions', () => {
  it('should contain disabled actions for non-owner private workspace', async () => {
    const { result } = renderHook(() => useWorkspaceActions(mockKonfluxWorkspaces[1]));
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Change visibility',
        disabledTooltip: "You don't have permission to change the visibility",
        id: 'change-visibility',
        disabled: true,
      }),
    );
  });
  it('should contain disabled actions for non-owner community workspace', async () => {
    const { result } = renderHook(() => useWorkspaceActions(mockKonfluxWorkspaces[2]));
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Change visibility',
        disabledTooltip: "You don't have permission to change the visibility",
        id: 'change-visibility',
        disabled: true,
      }),
    );
  });

  it('should contain enabled actions for owner workspace', async () => {
    const { result } = renderHook(() => useWorkspaceActions(mockKonfluxWorkspaces[0]));
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        id: 'change-visibility',
        disabled: false,
      }),
    );
  });
});
