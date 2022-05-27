import lodashEach from 'lodash/each';
import lodashFind from 'lodash/find';
import lodashGet from 'lodash/get';
import { RouteKind, RouteIngress } from './../types/routes';

const getRouteHost = (route: RouteKind, onlyAdmitted: boolean): string => {
  let oldestAdmittedIngress: RouteIngress;
  let oldestTransitionTime: string;
  lodashEach(route.status.ingress, (ingress) => {
    const admittedCondition = lodashFind(ingress.conditions, { type: 'Admitted', status: 'True' });
    if (
      admittedCondition &&
      (!oldestTransitionTime || oldestTransitionTime > admittedCondition.lastTransitionTime)
    ) {
      oldestAdmittedIngress = ingress;
      oldestTransitionTime = admittedCondition.lastTransitionTime;
    }
  });

  if (oldestAdmittedIngress) {
    return oldestAdmittedIngress.host;
  }

  return onlyAdmitted ? null : route.spec.host;
};

export const getRouteWebURL = (route: RouteKind): string => {
  const scheme = lodashGet(route, 'spec.tls.termination') ? 'https' : 'http';
  let url = `${scheme}://${getRouteHost(route, false)}`;
  if (route.spec.path) {
    url += route.spec.path;
  }
  return url;
};

export const getComponentRouteWebURL = (routes: RouteKind[], component: string): string => {
  const componentRoute = routes?.find(
    (route) => route.metadata?.labels?.['app.kubernetes.io/name'] === component,
  );

  return componentRoute && getRouteWebURL(componentRoute);
};
