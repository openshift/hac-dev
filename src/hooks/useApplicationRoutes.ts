import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { RouteGroupVersionKind } from './../models/route';
import { RouteKind } from './../types/routes';

export const useApplicationRoutes = (
  application: string,
): [routes: RouteKind[], loaded: boolean] => {
  const { namespace } = useWorkspaceInfo();
  const [allRoutes, loaded] = useK8sWatchResource<RouteKind[]>({
    groupVersionKind: RouteGroupVersionKind,
    namespace,
    isList: true,
  });

  const routes = React.useMemo(() => {
    if (!allRoutes?.length) {
      return [];
    }
    return allRoutes.filter(
      (route) => route.metadata?.labels?.['app.kubernetes.io/part-of'] === application,
    );
  }, [application, allRoutes]);

  return [routes, loaded];
};
