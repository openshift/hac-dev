import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseGroupVersionKind } from '../models';
import { ReleasePlanKind } from '../types/coreBuildService';

export const useReleasePlans = (namespace: string): [ReleasePlanKind[], boolean, unknown] =>
  useK8sWatchResource<ReleasePlanKind[]>({
    groupVersionKind: ReleaseGroupVersionKind,
    namespace,
    isList: true,
  });
