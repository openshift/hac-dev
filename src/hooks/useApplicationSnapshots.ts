import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { SnapshotGroupVersionKind } from '../models';
import { Snapshot } from '../types/coreBuildService';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

export const useApplicationSnapshots = (
  applicationName: string,
): [Snapshot[], boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();
  const [snapshots, loaded, loadError] = useK8sWatchResource<Snapshot[]>({
    groupVersionKind: SnapshotGroupVersionKind,
    namespace,
    isList: true,
  });

  const applicationSnapshots = React.useMemo(
    () => snapshots.filter((s) => s.spec.application === applicationName),
    [applicationName, snapshots],
  );

  return [applicationSnapshots, loaded, loadError];
};
