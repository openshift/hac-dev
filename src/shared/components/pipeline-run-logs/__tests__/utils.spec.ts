import { DataState, testPipelineRuns } from '../../../../__data__/pipelinerun-data';
import { ContainerStatus } from '../../types';
import {
  containerToLogSourceStatus,
  getLabelColorFromStatus,
  LOG_SOURCE_RESTARTING,
  LOG_SOURCE_RUNNING,
  LOG_SOURCE_TERMINATED,
  LOG_SOURCE_WAITING,
  pipelineRunFilterReducer,
  pipelineRunStatus,
  pipelineRunStatusToGitOpsStatus,
  runStatus,
} from '../utils';

describe('pipelineRunStatus', () => {
  it('should return Pending status for pipelineruns with no status or no conditions', () => {
    expect(pipelineRunStatus(testPipelineRuns[DataState.STATUS_WITHOUT_CONDITIONS])).toBe(
      'Pending',
    );
    expect(pipelineRunStatus(testPipelineRuns[DataState.STATUS_WITHOUT_CONDITION_TYPE])).toBe(
      'Pending',
    );
    expect(pipelineRunStatus(testPipelineRuns[DataState.STATUS_WITH_EMPTY_CONDITIONS])).toBe(
      'Pending',
    );
  });

  it('should return Pending status for pipelinerun status  with type as "Succeeded" & Pending condition', () => {
    expect(pipelineRunStatus(testPipelineRuns[DataState.PIPELINE_RUN_PENDING])).toBe('Pending');
  });

  it('should return Running status for pipelinerun status with type as "Succeeded" & status as "Unknown"', () => {
    const reducerOutput = pipelineRunStatus(testPipelineRuns[DataState.RUNNING]);
    expect(reducerOutput).toBe('Running');
  });

  it('should return Succeeded status for pipelinerun status with type as "Succeeded" & status as "True"', () => {
    const reducerOutput = pipelineRunStatus(testPipelineRuns[DataState.SUCCEEDED]);
    expect(reducerOutput).toBe('Succeeded');
  });

  it('should return failed status for all the failed pipelineruns"', () => {
    expect(pipelineRunStatus(testPipelineRuns[DataState.FAILED])).toBe('Failed');
    expect(pipelineRunStatus(testPipelineRuns[DataState.STATUS_WITH_UNKNOWN_REASON])).toBe(
      'Failed',
    );
    expect(pipelineRunStatus(testPipelineRuns[DataState.PIPELINE_RUN_STOPPING])).toBe('Failed');
    expect(pipelineRunStatus(testPipelineRuns[DataState.TASK_RUN_STOPPING])).toBe('Failed');
  });

  it('should return Cancelled status for pipelinerun status with reason as "StoppedRunFinally" and "CancelledRunFinally"', () => {
    expect(pipelineRunStatus(testPipelineRuns[DataState.PIPELINE_RUN_STOPPED])).toBe('Cancelled');
    expect(pipelineRunStatus(testPipelineRuns[DataState.PIPELINE_RUN_CANCELLED])).toBe('Cancelled');
    expect(pipelineRunStatus(testPipelineRuns[DataState.TASK_RUN_CANCELLED])).toBe('Cancelled');
  });

  it('should return Cancelling status for pipelinerun which is cancelled but finishing the current execution', () => {
    const reducerOutput = pipelineRunStatus(testPipelineRuns[DataState.PIPELINE_RUN_CANCELLING]);
    expect(reducerOutput).toBe('Cancelling');
  });

  it('should return Skipped status for pipleinerun with reason as "ConditionCheckFailed"', () => {
    expect(pipelineRunStatus(testPipelineRuns[DataState.SKIPPED])).toBe('Skipped');
  });
});

describe('pipelineRunFilterReducer', () => {
  it('should return a valid status', () => {
    expect(pipelineRunFilterReducer(testPipelineRuns[DataState.RUNNING])).toBe('Running');
  });

  it('should return "Pending" state for pipelinerun status with empty conditions', () => {
    expect(pipelineRunFilterReducer(testPipelineRuns[DataState.STATUS_WITH_EMPTY_CONDITIONS])).toBe(
      'Pending',
    );
  });
});

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

describe('pipelineRunStatusToGitOpsStatus', () => {
  it('should return the default case', () => {
    expect(pipelineRunStatusToGitOpsStatus('-')).toBe('Unknown');
  });

  it('should return the valid gitops statuses', () => {
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Succeeded)).toBe('Healthy');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Failed)).toBe('Degraded');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Running)).toBe('Progressing');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Pending)).toBe('Progressing');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Cancelled)).toBe('Suspended');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Cancelling)).toBe('Suspended');
    expect(pipelineRunStatusToGitOpsStatus(runStatus.Skipped)).toBe('Missing');
  });
});

describe('getLabelColorFromStatus', () => {
  it('should return the null', () => {
    expect(getLabelColorFromStatus(runStatus.Idle)).toBeNull();
    expect(getLabelColorFromStatus(runStatus.Pending)).toBeNull();
    expect(getLabelColorFromStatus(runStatus.Skipped)).toBeNull();
    expect(getLabelColorFromStatus(runStatus.PipelineNotStarted)).toBeNull();
  });

  it('should return green for success', () => {
    expect(getLabelColorFromStatus(runStatus.Succeeded)).toBe('green');
  });

  it('should return red for failed', () => {
    expect(getLabelColorFromStatus(runStatus.Failed)).toBe('red');
  });

  it('should return gold for cancelled/cancelling status', () => {
    expect(getLabelColorFromStatus(runStatus.Cancelled)).toBe('gold');
    expect(getLabelColorFromStatus(runStatus.Cancelling)).toBe('gold');
  });
});
