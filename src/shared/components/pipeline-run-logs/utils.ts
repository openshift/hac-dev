import { K8sModelCommon } from '@openshift/dynamic-plugin-sdk-utils';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { K8sGroupVersionKind } from '../../../dynamic-plugin-sdk';
import { GitOpsDeploymentHealthStatus } from '../../../types/gitops-deployment';

export const LOG_SOURCE_RESTARTING = 'restarting';
export const LOG_SOURCE_RUNNING = 'running';
export const LOG_SOURCE_TERMINATED = 'terminated';
export const LOG_SOURCE_WAITING = 'waiting';

export const containerToLogSourceStatus = (container): string => {
  if (!container) {
    return LOG_SOURCE_WAITING;
  }
  const { state, lastState } = container;
  if (state.waiting && !isEmpty(lastState)) {
    return LOG_SOURCE_RESTARTING;
  }
  if (state.waiting) {
    return LOG_SOURCE_WAITING;
  }
  if (state.terminated) {
    return LOG_SOURCE_TERMINATED;
  }
  return LOG_SOURCE_RUNNING;
};

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

export const PodModel: K8sModelCommon = {
  apiVersion: 'v1',
  // t('public~Pod')
  plural: 'pods',
  namespaced: true,
  kind: 'Pod',
  // t('public~Pods')
};

export const PodGroupVersionKind: K8sGroupVersionKind = {
  version: 'v1',
  kind: 'Pod',
};

export const PipelineRunGroupVersionKind: K8sGroupVersionKind = {
  group: 'tekton.dev',
  version: 'v1beta1',
  kind: 'PipelineRun',
};

export const PipelineRunModel: K8sModelCommon = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  // t('PipelineRun')
  // t('PipelineRuns')
  plural: 'pipelineruns',
  namespaced: true,
  kind: 'PipelineRun',
  crd: true,
};

// Converts the PipelineRun (and TaskRun) condition status into a human readable string.
// See also tkn cli implementation at https://github.com/tektoncd/cli/blob/release-v0.15.0/pkg/formatted/k8s.go#L54-L83
export const pipelineRunStatus = (pipelineRun): string => {
  if (!pipelineRun?.status) return 'Pending';

  const conditions = get(pipelineRun, ['status', 'conditions'], []);
  if (conditions.length === 0) return 'Pending';

  const cancelledCondition = conditions.find((c) => c.reason === 'Cancelled');
  const succeedCondition = conditions.find((c) => c.type === 'Succeeded');
  if (!succeedCondition || !succeedCondition.status) {
    return 'Pending';
  }
  const status =
    succeedCondition.status === 'True'
      ? 'Succeeded'
      : succeedCondition.status === 'False'
      ? 'Failed'
      : 'Running';

  if (
    [
      SucceedConditionReason.PipelineRunStopped,
      SucceedConditionReason.PipelineRunCancelled,
    ].includes(pipelineRun.spec?.status) &&
    !cancelledCondition
  ) {
    return 'Cancelling';
  }

  if (succeedCondition.reason && succeedCondition.reason !== status) {
    switch (succeedCondition.reason) {
      case SucceedConditionReason.PipelineRunStopped:
      case SucceedConditionReason.PipelineRunCancelled:
      case SucceedConditionReason.TaskRunCancelled:
      case SucceedConditionReason.Cancelled:
        return 'Cancelled';
      case SucceedConditionReason.PipelineRunStopping:
      case SucceedConditionReason.TaskRunStopping:
        return 'Failed';
      case SucceedConditionReason.CreateContainerConfigError:
      case SucceedConditionReason.ExceededNodeResources:
      case SucceedConditionReason.ExceededResourceQuota:
      case SucceedConditionReason.PipelineRunPending:
        return 'Pending';
      case SucceedConditionReason.ConditionCheckFailed:
        return 'Skipped';
      default:
        return status;
    }
  }
  return status;
};
export const pipelineRunFilterReducer = (pipelineRun): runStatus => {
  const status = pipelineRunStatus(pipelineRun);
  return (status || 'Pending') as runStatus;
};

export enum runStatus {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Running = 'Running',
  'In Progress' = 'In Progress',
  FailedToStart = 'FailedToStart',
  PipelineNotStarted = 'PipelineNotStarted',
  Skipped = 'Skipped',
  Cancelled = 'Cancelled',
  Cancelling = 'Cancelling',
  Pending = 'Pending',
  Idle = 'Idle',
}

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
  status: string,
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
