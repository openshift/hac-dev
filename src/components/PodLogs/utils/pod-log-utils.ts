import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';
import size from 'lodash/size';

export enum AllPodStatus {
  Running = 'Running',
  NotReady = 'Not Ready',
  Warning = 'Warning',
  Empty = 'Empty',
  Failed = 'Failed',
  Pending = 'Pending',
  Succeeded = 'Succeeded',
  Terminating = 'Terminating',
  Unknown = 'Unknown',
  ScaledTo0 = 'Scaled to 0',
  Idle = 'Idle',
  AutoScaledTo0 = 'Autoscaled to 0',
  ScalingUp = 'Scaling Up',
  CrashLoopBackOff = 'CrashLoopBackOff',
}

export const isContainerFailedFilter = (containerStatus) => {
  return containerStatus.state.terminated && containerStatus.state.terminated.exitCode !== 0;
};

const isContainerLoopingFilter = (containerStatus) => {
  return (
    containerStatus.state.waiting && containerStatus.state.waiting.reason === 'CrashLoopBackOff'
  );
};

const numContainersReadyFilter = (pod) => {
  const {
    status: { containerStatuses },
  } = pod;
  let numReady = 0;
  forEach(containerStatuses, (status) => {
    if (status.ready) {
      numReady++;
    }
  });
  return numReady;
};

export const isReady = (pod) => {
  const {
    spec: { containers },
  } = pod;
  const numReady = numContainersReadyFilter(pod);
  const total = size(containers);

  return numReady === total;
};

export const podWarnings = (pod) => {
  const {
    status: { phase, containerStatuses },
  } = pod;
  if (phase === AllPodStatus.Running && containerStatuses) {
    return map(containerStatuses, (containerStatus) => {
      if (!containerStatus.state) {
        return null;
      }

      if (isContainerFailedFilter(containerStatus)) {
        if (has(pod, ['metadata', 'deletionTimestamp'])) {
          return AllPodStatus.Failed;
        }
        return AllPodStatus.Warning;
      }
      if (isContainerLoopingFilter(containerStatus)) {
        return AllPodStatus.CrashLoopBackOff;
      }
      return null;
    }).filter((x) => x);
  }
  return null;
};

export const getPodStatus = (pod) => {
  if (has(pod, ['metadata', 'deletionTimestamp'])) {
    return AllPodStatus.Terminating;
  }
  const warnings = podWarnings(pod);
  if (warnings !== null && warnings.length) {
    if (warnings.includes(AllPodStatus.CrashLoopBackOff)) {
      return AllPodStatus.CrashLoopBackOff;
    }
    if (warnings.includes(AllPodStatus.Failed)) {
      return AllPodStatus.Failed;
    }
    return AllPodStatus.Warning;
  }
  const phase = get(pod, ['status', 'phase'], AllPodStatus.Unknown);
  if (phase === AllPodStatus.Running && !isReady(pod)) {
    return AllPodStatus.NotReady;
  }
  return phase;
};
