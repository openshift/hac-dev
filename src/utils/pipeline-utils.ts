import merge from 'lodash/merge';
import { preferredNameAnnotation } from '../consts/pipeline';
import { ClairScanResult, SCAN_RESULT } from '../hooks/useClairScanResults';
import { PipelineRunModel } from '../models';
import {
  Condition,
  PipelineRunKind,
  PLRTaskRunData,
  TaskRunKind,
  TektonResultsRun,
} from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';

export enum runStatus {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Running = 'Running',
  'In Progress' = 'In Progress',
  FailedToStart = 'FailedToStart',
  PipelineNotStarted = 'Starting',
  NeedsMerge = 'PR needs merge',
  Skipped = 'Skipped',
  Cancelled = 'Cancelled',
  Cancelling = 'Cancelling',
  Pending = 'Pending',
  Idle = 'Idle',
  TestWarning = 'Test Warnings',
  TestFailed = 'Test Failures',
  Unknown = 'Unknown',
}

export enum SucceedConditionReason {
  PipelineRunStopped = 'StoppedRunFinally',
  PipelineRunCancelled = 'CancelledRunFinally',
  TaskRunCancelled = 'TaskRunCancelled',
  Cancelled = 'Cancelled',
  PipelineRunStopping = 'PipelineRunStopping',
  PipelineRunPending = 'PipelineRunPending',
  TaskRunStopping = 'TaskRunStopping',
  CreateContainerConfigError = 'CreateContainerConfigError',
  ExceededNodeResources = 'ExceededNodeResources',
  ExceededResourceQuota = 'ExceededResourceQuota',
  ConditionCheckFailed = 'ConditionCheckFailed',
}

export const getDuration = (seconds: number, long?: boolean): string => {
  if (!seconds || seconds <= 0) {
    return 'less than a second';
  }
  let sec = Math.round(seconds);
  let min = 0;
  let hr = 0;
  let duration = '';
  if (sec >= 60) {
    min = Math.floor(sec / 60);
    sec %= 60;
  }
  if (min >= 60) {
    hr = Math.floor(min / 60);
    min %= 60;
  }
  if (hr > 0) {
    duration += long ? (hr === 1 ? `${hr} hour` : `${hr} hours`) : `${hr} h`;
    duration += ' ';
  }
  if (min > 0) {
    duration += long ? (min === 1 ? `${min} minute` : `${min} minutes`) : `${min} m`;
    duration += ' ';
  }
  if (sec > 0) {
    duration += long ? (sec === 1 ? `${sec} second` : `${sec} seconds`) : `${sec} s`;
  }

  return duration.trim();
};

export const calculateDuration = (startTime: string | number, endTime?: string | number) => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
  const durationInSeconds = (end - start) / 1000;
  return getDuration(durationInSeconds, true);
};

export const getRandomChars = (len = 6): string => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .slice(2, len + 2);
};

export const getPipelineRunData = (
  latestRun: PipelineRunKind,
  options?: { generateName: boolean },
): PipelineRunKind => {
  if (!latestRun) {
    // eslint-disable-next-line no-console
    console.error('Missing parameters, unable to create new PipelineRun');
    return null;
  }
  const pipelineName =
    latestRun.metadata.annotations?.[preferredNameAnnotation] ||
    latestRun.metadata.generateName ||
    latestRun.metadata.name;

  const resources = latestRun?.spec.resources;
  const workspaces = latestRun?.spec.workspaces;
  const params = latestRun?.spec.params;

  const annotations = merge(
    {},
    latestRun?.metadata?.annotations,
    !latestRun?.metadata.annotations?.[preferredNameAnnotation] && {
      [preferredNameAnnotation]: latestRun?.metadata?.generateName || pipelineName,
    },
  );
  //should not propagate this last-applied-configuration to a new pipelinerun.
  delete annotations['kubectl.kubernetes.io/last-applied-configuration'];

  const newPipelineRun = {
    apiVersion: latestRun.apiVersion,
    kind: PipelineRunModel.kind,
    metadata: {
      ...(options?.generateName
        ? {
            generateName: `${pipelineName}`,
          }
        : {
            name: `${pipelineName}-${getRandomChars()}`,
          }),
      annotations,
      namespace: latestRun.metadata.namespace,
      labels: merge({}, latestRun?.metadata?.labels),
    },
    spec: {
      ...(latestRun?.spec || {}),
      ...(latestRun?.spec.pipelineRef && {
        pipelineRef: {
          name: latestRun?.spec.pipelineRef.name,
          ...(latestRun?.spec.pipelineRef.bundle && {
            bundle: latestRun?.spec.pipelineRef.bundle,
          }),
        },
      }),
      resources,
      ...(params && { params }),
      workspaces,
      status: null,
    },
  };
  return newPipelineRun;
};

export const conditionsRunStatus = (conditions: Condition[], specStatus?: string): runStatus => {
  if (!conditions?.length) {
    return runStatus.Pending;
  }

  const cancelledCondition = conditions.find((c) => c.reason === 'Cancelled');
  const succeedCondition = conditions.find((c) => c.type === 'Succeeded');

  if (!succeedCondition || !succeedCondition.status) {
    return runStatus.Pending;
  }

  const status =
    succeedCondition.status === 'True'
      ? runStatus.Succeeded
      : succeedCondition.status === 'False'
      ? runStatus.Failed
      : runStatus.Running;

  if (
    [
      `${SucceedConditionReason.PipelineRunStopped}`,
      `${SucceedConditionReason.PipelineRunCancelled}`,
    ].includes(specStatus) &&
    !cancelledCondition
  ) {
    return runStatus.Cancelling;
  }

  if (!succeedCondition.reason || succeedCondition.reason === status) {
    return status;
  }

  switch (succeedCondition.reason) {
    case SucceedConditionReason.PipelineRunStopped:
    case SucceedConditionReason.PipelineRunCancelled:
    case SucceedConditionReason.TaskRunCancelled:
    case SucceedConditionReason.Cancelled:
      return runStatus.Cancelled;
    case SucceedConditionReason.PipelineRunStopping:
    case SucceedConditionReason.TaskRunStopping:
      return runStatus.Failed;
    case SucceedConditionReason.CreateContainerConfigError:
    case SucceedConditionReason.ExceededNodeResources:
    case SucceedConditionReason.ExceededResourceQuota:
    case SucceedConditionReason.PipelineRunPending:
      return runStatus.Pending;
    case SucceedConditionReason.ConditionCheckFailed:
      return runStatus.Skipped;
    default:
      return status;
  }
};

export const taskResultsStatus = (taskResults: TektonResultsRun[]): runStatus => {
  const testOutput = taskResults?.find((result) => result.name === 'HACBS_TEST_OUTPUT');
  if (testOutput) {
    try {
      const outputValues = JSON.parse(testOutput.value);
      switch (outputValues.result) {
        case 'FAILURE':
        case 'ERROR':
          return runStatus.TestFailed;
        case 'WARNING':
          return runStatus.TestWarning;
        case 'SKIPPED':
          return runStatus.Skipped;
        default:
          break;
      }
    } catch (e) {
      // ignore
    }
  }
  const scanResult = taskResults?.find((result) => result.name === SCAN_RESULT);
  if (scanResult) {
    try {
      const resultObj: ClairScanResult = JSON.parse(scanResult.value);
      if (resultObj.vulnerabilities?.critical || resultObj.vulnerabilities?.high) {
        return runStatus.TestFailed;
      }
      if (resultObj.vulnerabilities?.medium || resultObj.vulnerabilities?.low) {
        return runStatus.TestWarning;
      }
    } catch {
      // ignore
    }
  }
  return runStatus.Succeeded;
};

export const taskRunStatus = (taskRun: TaskRunKind | PLRTaskRunData): runStatus => {
  if (!taskRun?.status?.conditions?.length) {
    return runStatus.Pending;
  }

  const status = conditionsRunStatus(taskRun.status.conditions);

  return status === runStatus.Succeeded ? taskResultsStatus(taskRun.status.taskResults) : status;
};

export const pipelineRunStatus = (pipelineRun: PipelineRunKind): runStatus =>
  conditionsRunStatus(pipelineRun?.status?.conditions, pipelineRun?.spec?.status);

export const pipelineRunStatusToGitOpsStatus = (status: string): GitOpsDeploymentHealthStatus => {
  switch (status) {
    case 'Succeeded':
      return GitOpsDeploymentHealthStatus.Healthy;
    case 'Failed':
      return GitOpsDeploymentHealthStatus.Degraded;
    case 'Running':
    case 'Pending':
      return GitOpsDeploymentHealthStatus.Progressing;
    case 'Cancelling':
    case 'Cancelled':
      return GitOpsDeploymentHealthStatus.Suspended;
    case 'Skipped':
      return GitOpsDeploymentHealthStatus.Missing;
    default:
      return GitOpsDeploymentHealthStatus.Unknown;
  }
};

export const getLabelColorFromStatus = (
  status: runStatus,
): 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey' | 'gold' => {
  switch (status) {
    case runStatus.Succeeded:
      return 'green';
    case runStatus.Failed:
      return 'red';
    case runStatus['In Progress']:
    case runStatus.Running:
      return 'blue';
    case runStatus.Cancelled:
    case runStatus.Cancelling:
      return 'gold';
    case runStatus.Idle:
    case runStatus.Pending:
    case runStatus.Skipped:
    default:
      return null;
  }
};
