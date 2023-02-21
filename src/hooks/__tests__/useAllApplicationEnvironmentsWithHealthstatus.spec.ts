import { renderHook } from '@testing-library/react-hooks';
import {
  mockEnvironments,
  mockSnapshotEnvironmentBindings,
  SEB_STATUS,
} from '../__data__/mock-data';
import { useAllApplicationEnvironmentsWithHealthStatus } from '../useAllApplicationEnvironmentsWithHealthStatus';
import { useAllEnvironments } from '../useAllEnvironments';
import { useReleases } from '../useReleases';
import { useSnapshotsEnvironmentBindings } from '../useSnapshotsEnvironmentBindings';

jest.mock('../useAllEnvironments', () => {
  return {
    useAllEnvironments: jest.fn(),
  };
});
jest.mock('../useReleases', () => {
  return {
    useReleases: jest.fn(),
  };
});

jest.mock('../useSnapshotsEnvironmentBindings', () => {
  return {
    useSnapshotsEnvironmentBindings: jest.fn(),
  };
});

describe('useAllApplicationEnvironmentsWithHealthStatus', () => {
  const mockUseSnapshotsEnvironmentBindings = useSnapshotsEnvironmentBindings as jest.Mock;
  const mockUseAllEnvironments = useAllEnvironments as jest.Mock;
  const mockuseReleases = useReleases as jest.Mock;

  beforeEach(() => {
    mockUseAllEnvironments.mockReturnValue([mockEnvironments, true]);
    mockuseReleases.mockReturnValue([[], true]);
  });

  it('should return empty array if some resources are not loaded', async () => {
    mockUseAllEnvironments.mockReturnValue([[], false]);
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], true]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus, loaded] = result.current;

    expect(loaded).toEqual(false);
    expect(envsWithStatus.length).toEqual(0);
  });

  it('should return default status for managed environment', async () => {
    mockUseAllEnvironments.mockReturnValue([
      [{ ...mockEnvironments[0], spec: { ...mockEnvironments[0].spec, tags: ['managed'] } }],
      true,
    ]),
      mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], true]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus, loaded] = result.current;

    expect(loaded).toEqual(true);
    expect(envsWithStatus.length).toEqual(1);
  });

  it('should return Missing status', async () => {
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([[], true]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus, loaded] = result.current;

    expect(loaded).toEqual(true);
    expect(envsWithStatus.length).toEqual(1);
    expect(envsWithStatus[0].healthStatus).toBe('Missing');
    expect(envsWithStatus[0].lastDeploy).toBeUndefined();
  });

  it('should return Progressing status', async () => {
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([
      mockSnapshotEnvironmentBindings[SEB_STATUS.RUNNING],
      true,
    ]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus] = result.current;

    expect(envsWithStatus[0].healthStatus).toBe('Progressing');
  });

  it('should return Healthy status', async () => {
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([
      mockSnapshotEnvironmentBindings[SEB_STATUS.SUCCEEDED],
      true,
    ]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus] = result.current;

    expect(envsWithStatus[0].healthStatus).toBe('Healthy');
  });

  it('should return Degraded status', async () => {
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([
      mockSnapshotEnvironmentBindings[SEB_STATUS.DEGRADED],
      true,
    ]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus] = result.current;

    expect(envsWithStatus[0].healthStatus).toBe('Degraded');
  });

  it('should return default values for partial status', async () => {
    mockUseSnapshotsEnvironmentBindings.mockReturnValue([
      mockSnapshotEnvironmentBindings[SEB_STATUS.PARTIAL],
      true,
    ]);
    const { result } = renderHook(() =>
      useAllApplicationEnvironmentsWithHealthStatus('new-application'),
    );
    const [envsWithStatus] = result.current;

    expect(envsWithStatus[0].healthStatus).toBe('Progressing');
    expect(envsWithStatus[0].lastDeploy).toBeUndefined();
  });
});
