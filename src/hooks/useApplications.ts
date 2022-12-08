import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ApplicationGroupVersionKind } from '../models';
import { ApplicationKind } from '../types';

export const useApplications = (namespace: string): [ApplicationKind[], boolean, unknown] =>
  useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: ApplicationGroupVersionKind,
    namespace,
    isList: true,
  });
