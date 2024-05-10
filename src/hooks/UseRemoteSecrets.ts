import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { RemoteSecretGroupVersionKind, SecretGroupVersionKind } from '../models';
import { RemoteSecretKind, SecretKind } from '../types';

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

export const useSecrets = (namespace: string): [SecretKind[], boolean, unknown] => {
  const [secrets, loaded, error] = useK8sWatchResource<SecretKind[]>({
    groupVersionKind: SecretGroupVersionKind,
    namespace,
    isList: true,
  });

  return React.useMemo(
    () => [secrets.filter((rs) => !rs.metadata.deletionTimestamp), loaded, error],
    [secrets, loaded, error],
  );
};
