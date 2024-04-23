import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks';
import { runStatus } from '../../../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../../../utils/rbac';
import { useReleasePlanActions } from '../releaseplan-actions';

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useAccessReviewForModelMock = useAccessReviewForModel as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;

describe('useReleasePlanActions', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useAccessReviewForModelMock.mockReturnValue([true, true]);
  });

  it('should contain trigger actions', async () => {
    const { result } = renderHook(() =>
      useReleasePlanActions({
        metadata: { name: 'test-release-plan' },
        spec: { application: 'test-app' },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[0]).toEqual(
      expect.objectContaining({
        label: 'Trigger release plan',
        cta: {
          href: `/application-pipeline/release/workspaces/test-ws/application/test-app/release-plan/trigger/test-release-plan`,
        },
      }),
    );
  });

  it('should contain Edit actions', async () => {
    const { result } = renderHook(() =>
      useReleasePlanActions({
        metadata: { name: 'test-release-plan' },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[1]).toEqual(
      expect.objectContaining({
        label: 'Edit release plan',
        cta: {
          href: `/application-pipeline/release/workspaces/test-ws/release-plan/edit/test-release-plan`,
        },
      }),
    );
  });

  it('should contain Delete actions', async () => {
    const { result } = renderHook(() =>
      useReleasePlanActions({
        metadata: { name: 'test-release-plan' },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;

    expect(actions[2].label).toEqual('Delete release plan');
    expect(actions[2].id).toEqual('releaseplan-delete');
  });

  it('should contain disabled actions', async () => {
    useAccessReviewForModelMock.mockReturnValue([false, false]);
    const { result } = renderHook(() =>
      useReleasePlanActions({
        metadata: { name: 'test-release-plan' },
        status: { conditions: [{ type: 'Succeeded', status: runStatus.Running }] },
      } as any),
    );
    const actions = result.current;
    expect(actions[0].label).toEqual('Trigger release plan');
    expect(actions[0].disabled).toEqual(true);
    expect(actions[0].disabledTooltip).toEqual(
      "You don't have permission to trigger this release plan",
    );
    expect(actions[1].label).toEqual('Edit release plan');
    expect(actions[1].disabled).toEqual(true);
    expect(actions[1].disabledTooltip).toEqual(
      "You don't have permission to edit this release plan",
    );
    expect(actions[2].label).toEqual('Delete release plan');
    expect(actions[2].disabled).toEqual(true);
    expect(actions[2].disabledTooltip).toEqual(
      "You don't have permission to delete this release plan",
    );
  });
});
