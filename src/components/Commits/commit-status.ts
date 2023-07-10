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
        (a, b) => new Date(b.status?.startTime).getTime() - new Date(a.status?.startTime).getTime(),
      ),
    [pipelineRuns],
  );

  const commitStatus = React.useMemo(() => {
    if (!loaded || error) {
      return 'Pending';
    }

    const plrStatus = pipelineRunStatus(plrsForCommit?.[0]);
    if (statuses.includes(plrStatus)) {
      return plrStatus;
    }
    return 'Pending';
  }, [loaded, error, plrsForCommit]);

  return [commitStatus, loaded, error];
};
