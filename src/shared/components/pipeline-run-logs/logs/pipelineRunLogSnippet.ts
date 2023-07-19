import { Condition, PipelineRunKind, PLRTaskRunStep, TaskRunKind } from '../../../../types';
import { pipelineRunStatus, taskRunStatus } from '../../../../utils/pipeline-utils';
import { CombinedErrorDetails } from './log-snippet-types';
import { taskRunSnippetMessage } from './log-snippet-utils';

const isKnownReason = (reason: string): boolean => {
  // known reasons https://tekton.dev/vault/pipelines-v0.21.0/pipelineruns/#monitoring-execution-status
  return ['StoppedRunFinally', 'CancelledRunFinally', 'PipelineRunTimeout'].includes(reason);
};

export const getPLRLogSnippet = (
  pipelineRun: PipelineRunKind,
  taskRuns: TaskRunKind[],
): CombinedErrorDetails => {
  if (!pipelineRun?.status) {
    // Lack information to pull from the Pipeline Run
    return null;
  }
  if (pipelineRunStatus(pipelineRun) !== 'Failed') {
    // Not in a failed state, no need to get the log snippet
    return null;
  }

  const succeededCondition = pipelineRun.status.conditions?.find(
    (condition: Condition) => condition.type === 'Succeeded',
  );

  if (succeededCondition?.status !== 'False') {
    // Not in error / lack information
    return null;
  }

  const failedTaskRuns = taskRuns.filter((taskRun) =>
    taskRun?.status?.conditions?.find(
      (condition) => condition.type === 'Succeeded' && condition.status === 'False',
    ),
  );

  // We're intentionally looking at the first failure because we have to start somewhere - they have the YAML still
  const failedTaskRun = failedTaskRuns[0];

  if (!failedTaskRun || isKnownReason(succeededCondition?.reason)) {
    // No specific task run failure information, just print pipeline run status
    return {
      staticMessage: succeededCondition.message || 'Unknown failure condition',
      title: 'Failure - check logs for details.',
    };
  }

  const containerName = failedTaskRun.status.steps?.find(
    (step: PLRTaskRunStep) => step.terminated?.exitCode !== 0,
  )?.container;

  return taskRunSnippetMessage(
    failedTaskRun?.spec.taskRef?.name ?? failedTaskRun?.metadata.name,
    failedTaskRun.status,
    containerName,
  );
};

export const getTRLogSnippet = (taskRun: TaskRunKind): CombinedErrorDetails => {
  if (!taskRun?.status) {
    // Lack information to pull from the Pipeline Run
    return null;
  }
  if (taskRunStatus(taskRun) !== 'Failed') {
    // Not in a failed state, no need to get the log snippet
    return null;
  }

  const succeededCondition = taskRun.status.conditions?.find(
    (condition: Condition) => condition.type === 'Succeeded',
  );

  if (succeededCondition?.status !== 'False') {
    // Not in error / lack information
    return null;
  }

  if (isKnownReason(succeededCondition?.reason)) {
    // No specific task run failure information, just print pipeline run status
    return {
      staticMessage: succeededCondition.message || 'Unknown failure condition',
      title: 'Failure - check logs for details.',
    };
  }

  const containerName = taskRun.status.steps?.find(
    (step: PLRTaskRunStep) => step.terminated?.exitCode !== 0,
  )?.container;

  return taskRunSnippetMessage(taskRun.spec.taskRef?.name, taskRun.status, containerName);
};
