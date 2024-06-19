import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { SecretType } from '../../../types';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useSecretActions } from '../secret-actions';

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../modal/ModalProvider', () => ({
  useModalLauncher: jest.fn(() => 'cta'),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;

describe('useSecretActions', () => {
  beforeEach(() => {
    useAccessReviewForModelMock.mockReturnValue([true, true]);
  });

  it('should contain trigger actions', async () => {
    const { result } = renderHook(() =>
      useSecretActions({
        metadata: { name: 'test-secret' },
        type: SecretType.opaque,
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Delete',
        disabledTooltip: "You don't have access to delete this secret",
        id: 'delete-test-secret',
        disabled: false,
      }),
    );
  });
});
