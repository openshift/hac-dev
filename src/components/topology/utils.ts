import { RunStatus } from '@patternfly/react-topology';
import { runStatus } from '../../utils/pipeline-utils';

export const runStatusToRunStatus = (status: runStatus): RunStatus => {
  switch (status) {
    case runStatus.Succeeded:
      return RunStatus.Succeeded;
    case runStatus.Failed:
      return RunStatus.Failed;
    case runStatus.Running:
      return RunStatus.Running;
    case runStatus['In Progress']:
      return RunStatus.InProgress;
    case runStatus.FailedToStart:
    case runStatus.PipelineNotStarted:
      return RunStatus.FailedToStart;
    case runStatus.Skipped:
      return RunStatus.Skipped;
    case runStatus.Cancelled:
    case runStatus.Cancelling:
      return RunStatus.Cancelled;
    case runStatus.Pending:
      return RunStatus.Pending;
    case runStatus.Idle:
      return RunStatus.Idle;
    default:
      return RunStatus.Pending;
  }
};
