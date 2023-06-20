import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseGroupVersionKind } from '../models';
import { ReleaseKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { useApplicationSnapshots } from './useApplicationSnapshots';

export const useApplicationReleases = (
  applicationName: string,
): [ReleaseKind[], boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();
  const [releases, releasesLoaded, releasesError] = useK8sWatchResource<ReleaseKind[]>({
    groupVersionKind: ReleaseGroupVersionKind,
    namespace,
    isList: true,
  });

  const [snapshots, snapshotsLoaded, snapshotsError] = useApplicationSnapshots(applicationName);

  const releasesForApp = React.useMemo(
    () => releases.filter((r) => snapshots.some((s) => s.metadata.name === r.spec.snapshot)),
    [releases, snapshots],
  );

  return [releasesForApp, releasesLoaded && snapshotsLoaded, releasesError || snapshotsError];
};
