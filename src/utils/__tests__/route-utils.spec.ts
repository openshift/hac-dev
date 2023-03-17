import { mockRoutes } from '../../hooks/__data__/mock-data';
import { componentCRMocks } from './../../components/ApplicationDetails/__data__/mock-data';
import { getComponentRouteWebURL, getFirstComponentRouteWebURL } from './../route-utils';

describe('Route Utils', () => {
  it('Should return route url for given component', async () => {
    const result = getComponentRouteWebURL(mockRoutes, 'basic-node-js');

    expect(result).toEqual('https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com');
  });

  it('Should return undefined if route is not created for given component', async () => {
    const result = getComponentRouteWebURL(mockRoutes, 'nodejs-1');

    expect(result).toBeUndefined();
  });

  it('should find the first component that has route and return routeWebURL for it', () => {
    const result = getFirstComponentRouteWebURL(mockRoutes, [
      componentCRMocks[1],
      componentCRMocks[0],
    ]);

    expect(result).toEqual('https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com');
  });
});
