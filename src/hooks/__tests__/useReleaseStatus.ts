import { renderHook } from '@testing-library/react-hooks';
import { ReleaseCondition } from '../../types';
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

  it('should return in progress if release condition is progressing', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Succeeded', status: 'True', type: ReleaseCondition.Validated },
            { reason: 'Progressing', status: 'True', type: ReleaseCondition.Released },
          ],
        },
      }),
    );
    expect(result.current).toEqual('In Progress');
  });

  it('should return in succeeded if release condition is pass', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Succeeded', status: 'True', type: ReleaseCondition.Released },
            { reason: 'Progressing', status: 'True', type: ReleaseCondition.Validated },
          ],
        },
      }),
    );
    expect(result.current).toEqual('Succeeded');
  });

  it('should return in failed if release condition is fail', () => {
    const { result } = renderHook(() =>
      useReleaseStatus({
        ...mockRelease,
        status: {
          conditions: [
            { reason: 'Succeeded', status: 'True', type: ReleaseCondition.Processed },
            { reason: 'Succeeded', status: 'True', type: ReleaseCondition.Validated },
            { reason: 'Failed', status: 'False', type: ReleaseCondition.Released },
          ],
        },
      }),
    );
    expect(result.current).toEqual('Failed');
  });
});
