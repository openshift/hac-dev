import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useNamespace } from '../utils/namespace-context-utils';
import { RouteGroupVersionKind } from './../models/route';
import { RouteKind } from './../types/routes';

export const useApplicationRoutes = (
  application: string,
  namespace?: string,
): [routes: RouteKind[], loaded: boolean] => {
  const ns = useNamespace();
  const [allRoutes, loaded] = useK8sWatchResource<RouteKind[]>({
    groupVersionKind: RouteGroupVersionKind,
    namespace: namespace ?? ns,
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
