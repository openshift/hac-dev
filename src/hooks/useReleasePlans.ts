import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleasePlanGroupVersionKind } from '../hacbs/models';
import { ReleasePlanKind } from '../hacbs/types/coreBuildService';

export const useReleasePlans = (namespace: string): [ReleasePlanKind[], boolean, unknown] =>
  useK8sWatchResource<ReleasePlanKind[]>({
    groupVersionKind: ReleasePlanGroupVersionKind,
    namespace,
    isList: true,
  });
