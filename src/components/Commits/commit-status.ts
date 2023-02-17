import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import { pipelineRunFilterReducer } from '../../shared';
import { PipelineRunKind } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

export const useCommitStatus = (
  application: string,
  commit: string,
): [string, boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();
  const [pipelineruns, loaded, loadErr] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    namespace,
  });

  const plrsForCommit = React.useMemo(
    () =>
      pipelineruns
        ?.filter(
          (plr) =>
            plr.metadata.labels[PipelineRunLabel.APPLICATION] === application &&
            plr.metadata.labels[PipelineRunLabel.COMMIT_LABEL] === commit,
        )
        .sort((a, b) => parseInt(a.status?.startTime, 10) - parseInt(b.status?.startTime, 10)),
    [application, commit, pipelineruns],
  );

  const commitStatus = React.useMemo(() => {
    if (!loaded || loadErr) {
      return 'Pending';
    }

    const plrStatus = pipelineRunFilterReducer(plrsForCommit[plrsForCommit.length - 1]);
    if (statuses.includes(plrStatus)) {
      return plrStatus;
    }
    return 'Pending';
  }, [loaded, loadErr, plrsForCommit]);

  return [commitStatus, loaded, loadErr];
};
