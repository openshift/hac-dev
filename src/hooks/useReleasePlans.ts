import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleasePlanGroupVersionKind } from '../models';
import { ReleasePlanKind } from '../types/coreBuildService';

export const useReleasePlans = (namespace: string): [ReleasePlanKind[], boolean, unknown] =>
  useK8sWatchResource<ReleasePlanKind[]>({
    groupVersionKind: ReleasePlanGroupVersionKind,
    namespace,
    isList: true,
  });
