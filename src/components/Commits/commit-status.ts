import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../../models';
import { pipelineRunFilterReducer } from '../../shared';
import { PipelineRunKind } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { useNamespace } from '../../utils/namespace-context-utils';

export const useCommitStatus = (
  application: string,
  commit: string,
): [string, boolean, unknown] => {
  const namespace = useNamespace();
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
      return '-';
    }

    const plrStatus = pipelineRunFilterReducer(plrsForCommit[plrsForCommit.length - 1]);
    if (statuses.includes(plrStatus)) {
      return plrStatus;
    }
    return '-';
  }, [loaded, loadErr, plrsForCommit]);

  return [commitStatus, loaded, loadErr];
};
