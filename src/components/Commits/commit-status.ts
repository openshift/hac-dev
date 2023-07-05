import React from 'react';
import { usePipelineRunsForCommit } from '../../hooks/usePipelineRuns';
import { statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

export const useCommitStatus = (
  application: string,
  commit: string,
): [string, boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();

  const [pipelineRuns, loaded, error] = usePipelineRunsForCommit(namespace, application, commit);

  const plrsForCommit = React.useMemo(
    () =>
      pipelineRuns?.sort(
        (a, b) => parseInt(a.status?.startTime, 10) - parseInt(b.status?.startTime, 10),
      ),
    [pipelineRuns],
  );

  const commitStatus = React.useMemo(() => {
    if (!loaded || error) {
      return 'Pending';
    }

    const plrStatus = pipelineRunStatus(plrsForCommit[plrsForCommit.length - 1]);
    if (statuses.includes(plrStatus)) {
      return plrStatus;
    }
    return 'Pending';
  }, [loaded, error, plrsForCommit]);

  return [commitStatus, loaded, error];
};
