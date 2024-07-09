import curry from 'lodash/fp/curry';
import merge from 'lodash-es/merge';
import { preferredNameAnnotation } from '../consts/pipeline';
import { ScanResults, isCVEScanResult } from '../hooks/useScanResults';
import { PipelineRunModel } from '../models';
import {
  Condition,
  PipelineResult,
  PipelineRunKind,
  PipelineRunKindV1Beta1,
  TaskRunKind,
  TaskRunKindV1Beta1,
  TektonResourceLabel,
  TektonResultsRun,
} from '../types';
import { GitOpsDeploymentHealthStatus } from '../types/gitops-deployment';

export const COMPONENT_DESC =
  'A component is an image built from code in a source repository. Applications are sets of components that run together on environments.';
export const BUILD_DESC = `Every component requires a build to release. We’ll automatically trigger a single build. Subsequent builds will need to be manually requested.`;
export const TESTS_DESC = `Catch functional regressions from code changes by adding integration tests. Integration tests run in parallel, validating each new component build with the latest version of all other application components.`;
export const STATIC_ENV_DESC = `A static environment is a set of compute resources bundled together. Use static environments for developing, testing, and staging before releasing your application. You can share static environments across all applications within the workspace.`;
export const RELEASE_DESC = `After pushing your application to release, your application goes through a series of tests through the release pipeline to ensure the application complies with the  release policy set on the release target, also known as the "managed environment".`;
export const MANAGED_ENV_DESC = `A managed environment is your application release target. This release target is an external environment, set up in an external workspace, and managed by another team. It is set for each application and not automatically shared among applications within the workspace.`;

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

export const isPipelineV1Beta1 = (
  pipeiline: PipelineRunKind,
): pipeiline is PipelineRunKindV1Beta1 => pipeiline?.apiVersion === 'tekton.dev/v1beta1';

export const isTaskV1Beta1 = (task: TaskRunKind): task is TaskRunKindV1Beta1 =>
  task?.apiVersion === 'tekton.dev/v1beta1';

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

  const workspaces = latestRun?.spec.workspaces;
  const params = latestRun?.spec.params;

  const annotations = merge(
    {},
    latestRun?.metadata?.annotations,
    !latestRun?.metadata.annotations?.[preferredNameAnnotation] && {
      [preferredNameAnnotation]: latestRun?.metadata?.generateName || pipelineName,
    },
  );

  const resolver = isPipelineV1Beta1(latestRun)
    ? latestRun?.spec.pipelineRef?.bundle
    : latestRun?.spec.pipelineRef?.resolver;

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
          ...(resolver &&
            (isPipelineV1Beta1(latestRun)
              ? {
                  bundle: resolver,
                }
              : {
                  resolver,
                })),
        },
      }),
      ...(params && { params }),
      workspaces,
      status: null,
    },
  } as PipelineRunKind;
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
  const testOutput = taskResults?.find(
    (result) => result.name === 'HACBS_TEST_OUTPUT' || result.name === 'TEST_OUTPUT',
  );
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
  const scanResult = taskResults?.find((result) => isCVEScanResult(result));
  if (scanResult) {
    try {
      const resultObj: ScanResults = JSON.parse(scanResult.value);
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

export const taskRunStatus = (taskRun: TaskRunKind): runStatus => {
  if (!taskRun?.status?.conditions?.length) {
    return runStatus.Pending;
  }

  const status = conditionsRunStatus(taskRun.status.conditions);
  const results = isTaskV1Beta1(taskRun) ? taskRun.status?.taskResults : taskRun.status?.results;

  return status === runStatus.Succeeded ? taskResultsStatus(results) : status;
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

const SBOM_TASK = 'show-sbom';

export const getSbomTaskRun = (taskruns: TaskRunKind[]) =>
  taskruns.find((tr) => tr?.metadata?.labels?.[TektonResourceLabel.pipelineTask] === SBOM_TASK);

export const taskName = (taskrun: TaskRunKind) =>
  taskrun.spec.taskRef?.name ||
  taskrun.metadata.labels[TektonResourceLabel.pipelineTask] ||
  taskrun.metadata.labels[TektonResourceLabel.task] ||
  taskrun.spec.taskRef?.params?.find((r) => r.name === 'name')?.value;

export const getPipelineRunStatusResults = (pipelineRun: PipelineRunKind) => {
  return isPipelineV1Beta1(pipelineRun)
    ? pipelineRun.status?.pipelineResults
    : pipelineRun.status?.results;
};

const getPipelineRunStatusResultForKey = curry(
  (key: string, value: string, pipelineRun: PipelineRunKind): PipelineResult => {
    const results = getPipelineRunStatusResults(pipelineRun);
    return results?.find((res) => res[key] === value);
  },
);
export const getPipelineRunStatusResultForName = getPipelineRunStatusResultForKey('name');
