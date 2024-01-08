import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';
import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { useSnapshots } from '../../../hooks/useSnapshots';
import { runStatus } from '../../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { usePipelinererunAction, usePipelinerunActions } from '../pipelinerun-actions';

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

jest.mock('../../../hooks/useSnapshots', () => ({
  useSnapshots: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[{ metadata: { name: 'test-ns' } }], false],
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
const mockUseSnapshots = useSnapshots as jest.Mock;

describe('usePipelinerunActions', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    mockUseSnapshots.mockReturnValue([[{ metadata: { name: 'snp1' } }], true]);
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
    useAccessReviewForModelMock.mockReturnValue([false, true]);
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
        disabled: true,
        disabledTooltip: "You don't have access to rerun",
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

  it('should contain enabled Rerun action for test pipelinerun if scenario & snapsht', async () => {
    useAccessReviewForModelMock.mockReturnValue([true, true]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: {
          labels: {
            'pipelines.appstudio.openshift.io/type': 'test',
            [PipelineRunLabel.SNAPSHOT]: 'snp1',
            [PipelineRunLabel.TEST_SERVICE_SCENARIO]: 'scn1',
          },
        },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: false,
      }),
    );
  });

  it('should contain disabled Rerun action if scenario not specified', async () => {
    useAccessReviewForModelMock.mockReturnValue([false, false]);
    const { result } = renderHook(() =>
      usePipelinerunActions({
        metadata: {
          labels: {
            'pipelines.appstudio.openshift.io/type': 'test',
            [PipelineRunLabel.SNAPSHOT]: 'snp1',
          },
        },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Rerun',
        disabled: true,
        disabledTooltip: "You don't have access to rerun",
      }),
    );
  });

  it('should contain disabled Rerun action if test pipelinerun and not allowed to patch snapshot', async () => {
    useAccessReviewForModelMock.mockReturnValue([false, false]);
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
        disabledTooltip: "You don't have access to rerun",
      }),
    );
  });
});

describe('usePipelinererunAction', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    mockUseSnapshots.mockReturnValue([[{ metadata: { name: 'snp1' } }], true]);
  });

  it('should contain disabled rerurn action & tooltip for build plr without access', async () => {
    useAccessReviewForModelMock.mockReturnValue([false, true]);
    const { result } = renderHook(() =>
      usePipelinererunAction({
        metadata: { labels: { 'pipelines.appstudio.openshift.io/type': 'build' } },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const action = result.current;

    expect(action).toEqual(
      expect.objectContaining({
        isDisabled: true,
        disabledTooltip: "You don't have access to rerun",
      }),
    );

    expect(action.cta).toBeDefined();
  });

  it('should contain enabled rerun action & tooltip for test plr', async () => {
    useAccessReviewForModelMock.mockReturnValue([true, true]);
    const { result } = renderHook(() =>
      usePipelinererunAction({
        metadata: {
          labels: {
            'pipelines.appstudio.openshift.io/type': 'test',
            [PipelineRunLabel.SNAPSHOT]: 'snp1',
            [PipelineRunLabel.TEST_SERVICE_SCENARIO]: 'scn1',
          },
        },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const action = result.current;

    expect(action).toEqual(
      expect.objectContaining({
        isDisabled: false,
        disabledTooltip: null,
      }),
    );

    expect(action.cta).toBeDefined();
  });

  it('should contain disabled rerun action when scenario missing', async () => {
    useAccessReviewForModelMock.mockReturnValue([true, true]);
    const { result } = renderHook(() =>
      usePipelinererunAction({
        metadata: {
          labels: {
            'pipelines.appstudio.openshift.io/type': 'test',
            [PipelineRunLabel.SNAPSHOT]: 'snp1',
          },
        },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const action = result.current;

    expect(action).toEqual(
      expect.objectContaining({
        isDisabled: true,
        disabledTooltip: 'Missing snapshot or scenario',
      }),
    );

    expect(action.cta).toBeDefined();
  });

  it('should contain disabled rerun action when snapshot missing', async () => {
    useAccessReviewForModelMock.mockReturnValue([true, true]);
    const { result } = renderHook(() =>
      usePipelinererunAction({
        metadata: {
          labels: {
            'pipelines.appstudio.openshift.io/type': 'test',
            [PipelineRunLabel.TEST_SERVICE_SCENARIO]: 'scn1',
          },
        },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const action = result.current;

    expect(action).toEqual(
      expect.objectContaining({
        isDisabled: true,
        disabledTooltip: 'Missing snapshot or scenario',
      }),
    );

    expect(action.cta).toBeDefined();
  });
});
