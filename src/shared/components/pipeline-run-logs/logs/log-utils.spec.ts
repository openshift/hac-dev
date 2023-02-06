import { samplePod } from '../../../../__data__/pod-data';
import { getRenderContainers } from './logs-utils';

describe('getRenderContainers', () => {
  it('should render default values if invalid value is passed', () => {
    expect(getRenderContainers(null)).toEqual({
      containers: [],
      stillFetching: false,
    });
  });

  it('should render containers for the given pod', () => {
    expect(getRenderContainers(samplePod)).toEqual({
      containers: samplePod.spec.containers,
      stillFetching: false,
    });
  });
});
