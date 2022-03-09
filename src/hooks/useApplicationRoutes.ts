import * as React from 'react';
import { useK8sWatchResource } from './../dynamic-plugin-sdk';
import { RouteGroupVersionKind } from './../models/route';
import { RouteKind } from './../types/routes';

export const useApplicationRoutes = (
  application: string,
  namespace: string,
): [routes: RouteKind[], loaded: boolean] => {
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
      (route) =>
        route.metadata?.annotations?.['build.appstudio.openshift.io/application'] === application,
    );
  }, [application, allRoutes]);

  return [routes, loaded];
};
