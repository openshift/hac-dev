import { mockPods } from '../__data__/pod-mock-data';
import {
  getPodStatus,
  AllPodStatus,
  isContainerFailedFilter,
  isReady,
} from '../utils/pod-log-utils';

describe('pod-log-utils', () => {
  it('getPodStatus should return `warning` phase', () => {
    const status = getPodStatus(mockPods[0]);
    expect(status).toBe(AllPodStatus.Warning);
  });

  it('getPodStatus should return `pending` phase', () => {
    const mData = { ...mockPods[3], status: { phase: 'Pending' } };
    expect(getPodStatus(mData)).toBe('Pending');
  });

  it('getPodStatus should return `running` phase', () => {
    expect(getPodStatus(mockPods[2])).toBe('Running');
  });

  it('getPodStatus should return `terminating` phase', () => {
    const mData = { ...mockPods[2], metadata: { deletionTimestamp: 'mock' } };
    expect(getPodStatus(mData)).toBe('Terminating');
  });

  it('should return isReady `true`', () => {
    const status = isReady(mockPods[2]);
    expect(status).toBe(true);
  });

  it('should return isContainerFailed `false`', () => {
    const status = isReady(mockPods[0]);
    expect(status).toBe(false);
  });

  it('should return isContainerFailed `true`', () => {
    const status = isContainerFailedFilter(mockPods[0].status.containerStatuses[0]);
    expect(status).toBe(true);
  });

  it('should return isContainerFailed `false`', () => {
    const status = isContainerFailedFilter(mockPods[1].status.containerStatuses[0]);
    expect(status).toBe(false);
  });
});
