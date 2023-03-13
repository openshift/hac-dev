import { ContainerStatus } from '../../types';
import {
  containerToLogSourceStatus,
  LOG_SOURCE_RESTARTING,
  LOG_SOURCE_RUNNING,
  LOG_SOURCE_TERMINATED,
  LOG_SOURCE_WAITING,
} from '../utils';

describe('containerToLogSourceStatus', () => {
  it('should return waiting status', () => {
    let status = containerToLogSourceStatus(null);
    expect(status).toBe(LOG_SOURCE_WAITING);

    status = containerToLogSourceStatus({
      name: 'test',
      state: { waiting: {} },
    } as ContainerStatus);
    expect(status).toBe(LOG_SOURCE_WAITING);
  });

  it('should return restarting status', () => {
    const status = containerToLogSourceStatus({
      name: 'test',
      state: { waiting: {} },
      lastState: { [LOG_SOURCE_WAITING]: {} },
    } as ContainerStatus);
    expect(status).toBe(LOG_SOURCE_RESTARTING);
  });

  it('should return running Status', () => {
    const status = containerToLogSourceStatus({
      name: 'test',
      state: { running: {} },
    } as ContainerStatus);
    expect(status).toBe(LOG_SOURCE_RUNNING);
  });

  it('should return terminated Status', () => {
    const status = containerToLogSourceStatus({
      name: 'test',
      state: { terminated: {} },
    } as ContainerStatus);
    expect(status).toBe(LOG_SOURCE_TERMINATED);
  });
});
