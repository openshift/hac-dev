import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ApplicationGroupVersionKind } from '../../../models';
import { ApplicationKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';

const BASE_NAME = 'my-app';

export const useValidApplicationName = (): [string, boolean, unknown] => {
  const { namespace } = useWorkspaceInfo();

  const [applications, loaded, loadErr] = useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: ApplicationGroupVersionKind,
    namespace,
    isList: true,
  });

  const validName = React.useMemo(() => {
    if (!loaded) {
      return;
    }
    let name = BASE_NAME,
      i = 1;
    while (applications.some((app) => app.metadata.name === name)) {
      name = `${BASE_NAME}-${i}`;
      i++;
    }
    return name;
  }, [applications, loaded]);

  return [validName, loaded, loadErr];
};
