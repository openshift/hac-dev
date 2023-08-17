import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { RemoteSecretGroupVersionKind } from '../models';
import { RemoteSecretKind } from '../types';

export const useRemoteSecrets = (namespace: string): [RemoteSecretKind[], boolean, unknown] => {
  const [remoteSecrets, loaded, error] = useK8sWatchResource<RemoteSecretKind[]>({
    groupVersionKind: RemoteSecretGroupVersionKind,
    namespace,
    isList: true,
  });

  return React.useMemo(
    () => [remoteSecrets.filter((rs) => !rs.metadata.deletionTimestamp), loaded, error],
    [remoteSecrets, loaded, error],
  );
};
