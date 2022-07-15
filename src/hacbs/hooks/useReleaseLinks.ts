import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseLinkGroupVersionKind } from '../models';
import { ReleaseLinkKind } from '../types/coreBuildService';

export const useReleaseLinks = (namespace: string): [ReleaseLinkKind[], boolean, unknown] =>
  useK8sWatchResource<ReleaseLinkKind[]>({
    groupVersionKind: ReleaseLinkGroupVersionKind,
    namespace,
    isList: true,
  });
