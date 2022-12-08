import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseGroupVersionKind } from '../hacbs/models';
import { ReleaseKind } from '../hacbs/types/coreBuildService';

export const useReleases = (namespace: string): [ReleaseKind[], boolean, unknown] =>
  useK8sWatchResource<ReleaseKind[]>({
    groupVersionKind: ReleaseGroupVersionKind,
    namespace,
    isList: true,
  });
