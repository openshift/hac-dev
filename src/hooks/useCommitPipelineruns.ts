import * as React from 'react';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { PipelineRunKind } from '../types';
import { usePipelineRunsWithStatus } from '.';

export const useCommitPipelineruns = (
  applicationName: string,
  namespace: string,
  commitName: string,
): [PipelineRunKind[], boolean, unknown] => {
  const [pipelineRunsWithStatus, loaded, loadErr] = usePipelineRunsWithStatus(
    namespace,
    applicationName,
  );

  const commitPipelineRuns = React.useMemo(
    () =>
      pipelineRunsWithStatus?.filter(
        (plr) =>
          plr?.metadata?.labels[PipelineRunLabel.COMMIT_LABEL] === commitName ||
          plr?.metadata?.labels[PipelineRunLabel.TEST_SERVICE_COMMIT] === commitName,
      ) || [],
    [pipelineRunsWithStatus, commitName],
  );

  return [commitPipelineRuns, loaded, loadErr];
};
