import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ApplicationGroupVersionKind } from '../models';
import { ApplicationKind } from '../types';

export const useApplications = (namespace: string): [ApplicationKind[], boolean, unknown] => {
  const [applications, loaded, error] = useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: ApplicationGroupVersionKind,
    namespace,
    isList: true,
  });

  return React.useMemo(
    () => [
      applications.filter((application) => !application.metadata.deletionTimestamp),
      loaded,
      error,
    ],
    [applications, loaded, error],
  );
};

export const useApplication = (
  namespace: string,
  applicationName: string,
): [ApplicationKind, boolean, unknown] => {
  const [application, loaded, error] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: ApplicationGroupVersionKind,
    name: applicationName,
    namespace,
  });

  return React.useMemo(() => {
    if (loaded && !error && application.metadata.deletionTimestamp) {
      return [null, loaded, { code: 404 }];
    }
    return [application, loaded, error];
  }, [application, loaded, error]);
};
