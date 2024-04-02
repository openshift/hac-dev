import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { SnapshotGroupVersionKind } from '../models';
import { Snapshot } from '../types/coreBuildService';

export const useSnapshots = (
  namespace: string,
  commit?: string,
): [Snapshot[], boolean, unknown] => {
  const [snapshots, loaded, error] = useK8sWatchResource<Snapshot[]>({
    groupVersionKind: SnapshotGroupVersionKind,
    namespace,
    isList: true,
  });
  return React.useMemo(
    () => [
      loaded && !error && commit
        ? snapshots.filter(
            (snapshot) =>
              snapshot.metadata.labels?.[PipelineRunLabel.TEST_SERVICE_COMMIT] === commit ||
              snapshot.metadata.annotations?.[PipelineRunLabel.COMMIT_ANNOTATION] === commit,
          )
        : snapshots,
      loaded,
      error,
    ],
    [commit, error, loaded, snapshots],
  );
};
