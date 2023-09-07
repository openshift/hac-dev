import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { SpaceBindingRequestGroupVersionKind } from '../models';
import { SpaceBindingRequest } from '../types';

export const useSpaceBindingRequests = (
  namespace: string,
): [SpaceBindingRequest[], boolean, unknown] => {
  const [sbrs, loaded, error] = useK8sWatchResource<SpaceBindingRequest[]>({
    groupVersionKind: SpaceBindingRequestGroupVersionKind,
    namespace,
    isList: true,
  });

  return React.useMemo(
    () => [sbrs.filter((sbr) => !sbr.metadata.deletionTimestamp), loaded, error],
    [sbrs, loaded, error],
  );
};
