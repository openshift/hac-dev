import * as React from 'react';
import { getFirstComponentRouteWebURL } from '../utils/route-utils';
import { useSortedComponents } from './useComponents';
import { useApplicationRoutes } from '.';

export const useLatestApplicationRouteURL = (application: string) => {
  const [components, componentsLoaded] = useSortedComponents(application);

  const [routes, loaded] = useApplicationRoutes(application);

  return React.useMemo(
    () =>
      loaded && routes.length > 0 && componentsLoaded && components.length > 0
        ? getFirstComponentRouteWebURL(routes, components)
        : null,
    [components, componentsLoaded, loaded, routes],
  );
};
