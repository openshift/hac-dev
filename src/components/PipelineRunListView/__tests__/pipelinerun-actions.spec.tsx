import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';
import { runStatus } from '../../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { usePipelinerunActions } from '../pipelinerun-actions';

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../utils/component-utils', () => {
  return {
    isPACEnabled: true,
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[{ metadata: { name: 'test-ns' } }], false],
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;

describe('usePipelinerunActions', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  it('should contain enabled actions', async () => {
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: { labels: { 'pipelines.appstudio.openshift.io/type': 'build' } },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: false,
        disabledTooltip: null,
      }),
    );

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: false,
        disabledTooltip: undefined,
      }),
    );

    expect(actions[2]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: false,
        disabledTooltip: undefined,
      }),
    );
  });

  it('should contain disabled actions for Stop and Cancel', async () => {
    useAccessReviewForModelMock.mockReturnValueOnce([true, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        status: { conditions: [{ type: 'Succeeded', status: 'True' }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: true,
        disabledTooltip: undefined,
      }),
    );
    expect(actions[2]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: true,
        disabledTooltip: undefined,
      }),
    );
  });

  it('should contain enabled rerun actions when PAC enabled', async () => {
    useAccessReviewForModelMock.mockReturnValueOnce([true, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: { labels: { 'pipelines.appstudio.openshift.io/type': 'build' } },
        status: { conditions: [{ type: 'Succeeded', status: 'True' }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: false,
        disabledTooltip: null,
      }),
    );
  });

  it('should contain disabled actions due to access', async () => {
    useAccessReviewForModelMock.mockReturnValueOnce([false, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: { labels: { 'pipelines.appstudio.openshift.io/type': 'build' } },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: false,
        disabledTooltip: null,
      }),
    );

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Stop',
        disabled: true,
        disabledTooltip: "You don't have access to stop this pipeline",
      }),
    );

    expect(actions[2]).toEqual(
      expect.objectContaining({
        label: 'Cancel',
        disabled: true,
        disabledTooltip: "You don't have access to cancel this pipeline",
      }),
    );
  });

  it('should contain disabled Rerun action if test pipelinerun', async () => {
    useAccessReviewForModelMock.mockReturnValueOnce([true, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: { labels: { 'pipelines.appstudio.openshift.io/type': 'test' } },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: true,
        disabledTooltip: null,
      }),
    );
  });
});
