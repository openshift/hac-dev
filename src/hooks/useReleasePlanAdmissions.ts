import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleasePlanAdmissionGroupVersionKind } from '../models/release-plan-admission';
import { ReleasePlanAdmissionKind } from '../types/release-plan-admission';

export const useReleasePlanAdmissions = (
  namespace: string,
): [ReleasePlanAdmissionKind[], boolean, unknown] =>
  useK8sWatchResource<ReleasePlanAdmissionKind[]>({
    groupVersionKind: ReleasePlanAdmissionGroupVersionKind,
    namespace,
    isList: true,
  });
