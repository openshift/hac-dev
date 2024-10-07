import { commonFetchJSON } from '@openshift/dynamic-plugin-sdk-utils';
import { DataState, testPipelineRuns } from '../../__data__/pipelinerun-data';
import { PipelineRunModel } from '../../models';
import { PipelineRunKind, TaskRunKind } from '../../types';
import {
  calculateDuration,
  getDuration,
  getPipelineRunData,
  getRandomChars,
  getLabelColorFromStatus,
  pipelineRunStatus,
  pipelineRunStatusToGitOpsStatus,
  runStatus,
  taskName,
  isPipelineV1Beta1,
  isTaskV1Beta1,
  fetchPipelineRun,
} from '../pipeline-utils';
import { getFilteredPipelineRuns } from '../tekton-results';

const samplePipelineRun = testPipelineRuns[DataState.SUCCEEDED];

describe('getDuration', () => {
  it('handles invalid values', () => {
    [0, -1, -9999].forEach((v) => expect(getDuration(v)).toBe('less than a second'));
  });

  it('returns correct durations in short format', () => {
    expect(getDuration(60 * 60 * 12)).toEqual('12 h');
    expect(getDuration(60)).toEqual('1 m');
    expect(getDuration(45)).toEqual('45 s');
  });
  it('returns correct durations in long format', () => {
    expect(getDuration(60 * 60 * 12, true)).toEqual('12 hours');
    expect(getDuration(60, true)).toEqual('1 minute');
    expect(getDuration(60 * 2, true)).toEqual('2 minutes');
    expect(getDuration(45, true)).toEqual('45 seconds');
  });
});

describe('calculateDuration', () => {
  it('should return definite duration', () => {
    let duration = calculateDuration('2020-05-22T11:57:53Z', '2020-05-22T11:57:57Z');
    expect(duration).toEqual('4 seconds');

    duration = calculateDuration('2020-05-22T11:57:53Z', '2020-05-22T12:02:20Z');
    expect(duration).toBe('4 minutes 27 seconds');

    duration = calculateDuration('2020-05-22T10:57:53Z', '2020-05-22T12:57:57Z');
    expect(duration).toBe('2 hours 4 seconds');
  });
});

describe('getRandomCharacters', () => {
  it('should return 6 digit random alphanumeric characters as default', () => {
    const randomOutput = getRandomChars();
    expect(randomOutput).toHaveLength(6);
  });

  it('should return 2 digit random alphanumeric characters', () => {
    const randomOutput = getRandomChars(2);
    expect(randomOutput).toHaveLength(2);
  });
});

describe('getPipelineRunData', () => {
  it('should return null', () => {
    expect(getPipelineRunData(null)).toBeNull();
  });

  it('should have a different name for the new pipelinerun created out of the old pipelinerun', () => {
    const runData = getPipelineRunData(samplePipelineRun);
    expect(runData.metadata.name).not.toBe(samplePipelineRun.metadata.name);
  });

  it('should not contain the last applied configuration for the new pipelinerun object', () => {
    const pipelineRunWithLastAppliedConf: PipelineRunKind = {
      ...samplePipelineRun,
      metadata: {
        ...samplePipelineRun.metadata,
        annotations: {
          ...samplePipelineRun.metadata.annotations,
          ['kubectl.kubernetes.io/last-applied-configuration']: `{
            apiVersion: 'v1',
            kind: 'PipelineRun',
          }`,
        },
      },
    };
    const runData = getPipelineRunData(pipelineRunWithLastAppliedConf);
    expect(runData.metadata['kubectl.kubernetes.io/last-applied-configuration']).not.toBeDefined();
  });

  it('should set generateName field when the option is passed', () => {
    const runData = getPipelineRunData(samplePipelineRun, { generateName: true });
    expect(runData.metadata.name).not.toBeDefined();
    expect(runData.metadata.generateName).toBe(`${samplePipelineRun.metadata.generateName}`);
  });

  it('should set metadata.name field when the generateName option is not passed', () => {
    const runData = getPipelineRunData(samplePipelineRun);
    expect(runData.metadata.generateName).not.toBeDefined();
    expect(runData.metadata.name).toBeDefined();
  });

  it('should use legacy resolver format for beta1 pipelineruns', () => {
    const pipelineRun = {
      ...samplePipelineRun,
      apiVersion: 'tekton.dev/v1beta1',
      spec: {
        pipelineRef: {
          name: 'test',
          bundle: 'test',
        },
      },
    };
    const runData = getPipelineRunData(pipelineRun);
    expect(runData.spec.pipelineRef).toEqual({ name: 'test', bundle: 'test' });
  });
});

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

describe('taskName', () => {
  it('should try to find out correct task name from taskRef or labels', () => {
    expect(taskName({ spec: { taskRef: { name: 'my-task' } } } as TaskRunKind)).toBe('my-task');
    expect(
      taskName({
        spec: {},
        metadata: { labels: { ['tekton.dev/pipelineTask']: 'my-task' } },
      } as unknown as TaskRunKind),
    ).toBe('my-task');
    expect(
      taskName({
        spec: {},
        metadata: { labels: { ['tekton.dev/task']: 'my-task' } },
      } as unknown as TaskRunKind),
    ).toBe('my-task');
    expect(
      taskName({
        metadata: { labels: {} },
        spec: { taskRef: { params: [{ name: 'name', value: 'my-task' }] } },
      } as TaskRunKind),
    ).toBe('my-task');
    expect(
      taskName({
        metadata: { labels: {} },
        spec: { taskRef: { params: [{ name: 'myparam', value: 'my-task' }] } },
      } as TaskRunKind),
    ).toBe(undefined);
  });
});

describe('isTaskV1Beta1', () => {
  it('should identify correct api version', () => {
    expect(isTaskV1Beta1({ apiVersion: 'tekton.dev/v1beta1' } as any)).toBe(true);
    expect(isTaskV1Beta1({ apiVersion: 'tekton.dev/v1' } as any)).toBe(false);
  });
});

describe('isPipelineV1Beta1', () => {
  it('should identify correct api version', () => {
    expect(isPipelineV1Beta1({ apiVersion: 'tekton.dev/v1beta1' } as any)).toBe(true);
    expect(isPipelineV1Beta1({ apiVersion: 'tekton.dev/v1' } as any)).toBe(false);
  });
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return { ...actual, commonFetchJSON: jest.fn() };
});
jest.mock('../tekton-results', () => ({ getFilteredPipelineRuns: jest.fn() }));

const mockCommonFetchJSON = commonFetchJSON as unknown as jest.Mock;
const mockGetFilteredPipelineRun = getFilteredPipelineRuns as jest.Mock;
describe('fetchPipelineRun', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call commonFetchJSON to fetch pipeline run', async () => {
    const workspace = 'test-workspace';
    const namespace = 'test-namespace';
    const pipelineName = 'pipeline-mock';
    mockCommonFetchJSON.mockReturnValue({ metadata: { name: pipelineName } } as PipelineRunKind);
    await fetchPipelineRun(workspace, namespace, pipelineName);
    expect(mockCommonFetchJSON).toHaveBeenCalledTimes(1);
    expect(mockGetFilteredPipelineRun).not.toHaveBeenCalled();
    expect(mockCommonFetchJSON).toHaveBeenCalledWith(
      `/workspaces/${workspace}/apis/${PipelineRunModel.apiGroup}/${PipelineRunModel.apiVersion}/namespaces/${namespace}/pipelineruns/${pipelineName}`,
    );
  });

  it('should call getFilteredPipelinerun to fetch pipeline run when commonFetchJSON throws 404 error', async () => {
    const workspace = 'test-workspace';
    const namespace = 'test-namespace';
    const pipelineName = 'pipeline-mock';
    mockCommonFetchJSON.mockRejectedValue({ code: 404 });
    mockGetFilteredPipelineRun.mockReturnValue([[]]);
    try {
      await fetchPipelineRun(workspace, namespace, pipelineName);
    } catch (e) {
      expect(e.code).toEqual(404);
    }
    expect(mockCommonFetchJSON).toHaveBeenCalledTimes(1);
    expect(mockCommonFetchJSON).toHaveBeenCalledWith(
      `/workspaces/${workspace}/apis/${PipelineRunModel.apiGroup}/${PipelineRunModel.apiVersion}/namespaces/${namespace}/pipelineruns/${pipelineName}`,
    );
    expect(mockGetFilteredPipelineRun).toHaveBeenCalledTimes(1);
    expect(mockGetFilteredPipelineRun).toHaveBeenCalledWith(
      workspace,
      namespace,
      `data.metadata.name=="${pipelineName}"`,
    );
  });

  it('should not call getFilteredPipelinerun to fetch pipeline run when commonFetchJSON throws error other than 404', async () => {
    const workspace = 'test-workspace';
    const namespace = 'test-namespace';
    const pipelineName = 'pipeline-mock';
    mockCommonFetchJSON.mockRejectedValue({ code: 403 });
    try {
      await fetchPipelineRun(workspace, namespace, pipelineName);
    } catch (e) {
      expect(e.code).toEqual(403);
    }
    expect(mockCommonFetchJSON).toHaveBeenCalledTimes(1);
    expect(mockCommonFetchJSON).toHaveBeenCalledWith(
      `/workspaces/${workspace}/apis/${PipelineRunModel.apiGroup}/${PipelineRunModel.apiVersion}/namespaces/${namespace}/pipelineruns/${pipelineName}`,
    );
    expect(mockGetFilteredPipelineRun).toHaveBeenCalledTimes(0);
  });
});
