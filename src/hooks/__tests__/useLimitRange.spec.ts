import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react';
import { mockLimitRange } from '../__data__/mock-data';
import { useLimitRange, useLimitRanges, useResourceLimits } from '../useLimitRange';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('useLimitRanges', () => {
  it('should return all the available limit ranges', () => {
    watchResourceMock.mockReturnValue([[mockLimitRange], true]);
    const { result } = renderHook(() => useLimitRanges('test-ns'));

    const [limitRange, loaded] = result.current;
    expect(watchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        groupVersionKind: expect.objectContaining({ kind: 'LimitRange' }),
      }),
    );
    expect(loaded).toEqual(true);
    expect(limitRange).toBeDefined();
  });
});

describe('useLimitRange', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if name is not specified', () => {
    watchResourceMock.mockReturnValue([null, true]);
    const { result } = renderHook(() => useLimitRange('test-ns'));

    const [limitRange, loaded] = result.current;
    expect(watchResourceMock).toHaveBeenCalledWith(undefined);
    expect(loaded).toEqual(true);
    expect(limitRange).toBeNull();
  });

  it('should return null if the returned resource is marked for deletion', () => {
    const markedForDeletion = {
      ...mockLimitRange,
      metadata: {
        ...mockLimitRange.metadata,
        deletionTimestamp: new Date(),
      },
    };

    watchResourceMock.mockReturnValue([markedForDeletion, true]);
    const { result } = renderHook(() => useLimitRange('test-ns'));

    const [limitRange, loaded] = result.current;
    expect(watchResourceMock).toHaveBeenCalledWith(undefined);
    expect(loaded).toEqual(true);
    expect(limitRange).toBeNull();
  });

  it('should return limit range component', () => {
    watchResourceMock.mockReturnValue([mockLimitRange, true]);
    const { result } = renderHook(() => useLimitRange('test-ns', 'resource-limits'));

    const [limitRange, loaded] = result.current;
    expect(watchResourceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        groupVersionKind: expect.objectContaining({ kind: 'LimitRange' }),
      }),
    );
    expect(loaded).toEqual(true);
    expect(limitRange).toBeDefined();
  });
});

describe('useResourceLimits', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return default values the fetch call is in loading state', () => {
    watchResourceMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => useResourceLimits('test-ns'));

    const resourceLimit = result.current;
    expect(resourceLimit).toEqual({
      cpu: '10',
      cpuUnit: 'millicores',
      memory: '256',
      memoryUnit: 'Mi',
    });
  });

  it('should return default values if the resource-limits cr is not present', () => {
    watchResourceMock.mockReturnValue([null, true]);
    const { result } = renderHook(() => useResourceLimits('test-ns'));

    const resourceLimit = result.current;
    expect(resourceLimit).toEqual({
      cpu: '10',
      cpuUnit: 'millicores',
      memory: '50',
      memoryUnit: 'Mi',
    });
  });

  it('should return default values from the limit range resource', () => {
    watchResourceMock.mockReturnValue([mockLimitRange, true]);
    const { result } = renderHook(() => useResourceLimits('test-ns'));

    const resourceLimit = result.current;
    expect(resourceLimit).toEqual({
      cpu: '10',
      cpuUnit: 'millicores',
      memory: '256',
      memoryUnit: 'Mi',
    });
  });

  it('should return maximum cluster default values from the limit range resource', () => {
    watchResourceMock.mockReturnValue([mockLimitRange, true]);
    const { result } = renderHook(() => useResourceLimits('test-ns', true));

    const resourceLimit = result.current;
    expect(resourceLimit).toEqual({
      cpu: '2',
      cpuUnit: 'cores',
      memory: '2',
      memoryUnit: 'Gi',
    });
  });
});
