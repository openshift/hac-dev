import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { runStatus } from '../../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { usePipelinerunActions } from '../pipelinerun-actions';

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;

describe('usePipelinerunActions', () => {
  it('should contain enabled actions', async () => {
    const { result } = renderHook(() =>
      usePipelinerunActions({
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: false,
        disabledTooltip: undefined,
      }),
    );

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: false,
        disabledTooltip: undefined,
      }),
    );
  });

  it('should contain disabled actions', async () => {
    const { result } = renderHook(() =>
      usePipelinerunActions({
        status: { conditions: [{ type: 'Succeeded', status: 'True' }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: true,
        disabledTooltip: undefined,
      }),
    );
    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: true,
        disabledTooltip: undefined,
      }),
    );
  });

  it('should contain disabled actions due to access', async () => {
    useAccessReviewForModelMock.mockReturnValueOnce([false, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: true,
        disabledTooltip: "You don't have access to stop this pipeline",
      }),
    );
    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: true,
        disabledTooltip: "You don't have access to cancel this pipeline",
      }),
    );
  });
});
