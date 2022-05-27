import { mockRoutes } from '../../hooks/__data__/mock-data';
import { getComponentRouteWebURL } from './../route-utils';

describe('Route Utils', () => {
  it('Should return route url for given component', async () => {
    const result = getComponentRouteWebURL(mockRoutes, 'nodejs');

    expect(result).toEqual('https://nodejs-test.apps.appstudio-stage.x99m.p1.openshiftapps.com');
  });

  it('Should return undefined if route is not created for given component', async () => {
    const result = getComponentRouteWebURL(mockRoutes, 'nodejs-1');

    expect(result).toBeUndefined();
  });
});
