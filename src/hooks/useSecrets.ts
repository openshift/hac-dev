import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { SecretGroupVersionKind } from '../models';
import { SecretKind } from '../types';

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
