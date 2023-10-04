import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useSBRActions } from '../user-access-actions';

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ workspace: 'test-ws' })),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;

describe('useSBRActions', () => {
  it('should return enabled actions', async () => {
    const { result } = renderHook(() => useSBRActions({ metadata: { name: 'test-sbr' } } as any));
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Edit access',
        disabled: false,
        cta: {
          href: '/application-pipeline/access/workspaces/test-ws/edit/test-sbr',
        },
      }),
    );

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Revoke access',
        disabled: false,
      }),
    );
  });

  it('should return disabled actions due to access', async () => {
    useAccessReviewForModelMock.mockReturnValue([false, true]);
    const { result } = renderHook(() => useSBRActions({ metadata: { name: 'test-sbr' } } as any));
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Edit access',
        disabled: true,
        disabledTooltip: "You don't have permisison to edit access",
      }),
    );
    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Revoke access',
        disabled: true,
        disabledTooltip: "You don't have permisison to revoke access",
      }),
    );
  });
});
