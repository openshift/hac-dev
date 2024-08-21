import { renderHook } from '@testing-library/react';
import { useReleaseStatus } from '../useReleaseStatus';

const mockRelease = {
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  kind: 'Release',
  metadata: {
    name: 'test-release',
  },
  spec: {
    releasePlan: 'test-plan',
    snapshot: 'test-snapshot',
  },
};

describe('useApplicationSnapshots', () => {
  it('should return unknown if status is not available', () => {
    const { result } = renderHook(() => useReleaseStatus(mockRelease));
    expect(result.current).toEqual('Unknown');
  });

  it('should return in progress if any of the conditions is progressing', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Progressing' },
            { reason: 'Succeeded', status: 'True' },
            { reson: 'Failed', status: 'False' },
          ],
        },
      }),
    );
    expect(result.current).toEqual('In Progress');
  });

  it('should return in succeeded if all of the conditions pass', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Succeeded', status: 'True' },
            { reason: 'Succeeded', status: 'True' },
          ],
        },
      }),
    );
    expect(result.current).toEqual('Succeeded');
  });

  it('should return in failed if any of the conditions fail', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Succeeded', status: 'True' },
            { reason: 'Succeeded', status: 'True' },
            { reason: 'Failed', status: 'False' },
          ],
        },
      }),
    );
    expect(result.current).toEqual('Failed');
  });
});
