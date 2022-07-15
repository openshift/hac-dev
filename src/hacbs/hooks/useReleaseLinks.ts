import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ReleaseGroupVersionKind } from '../models';
import { ReleaseLinkKind } from '../types/coreBuildService';

export const useReleaseLinks = (namespace: string): [ReleaseLinkKind[], boolean, unknown] =>
  useK8sWatchResource<ReleaseLinkKind[]>({
    groupVersionKind: ReleaseGroupVersionKind,
    namespace,
    isList: true,
  });
