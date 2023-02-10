import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { mockRoutes } from '../__data__/mock-data';
import { useApplicationRoutes } from '../useApplicationRoutes';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const originalModule = (jest as any).requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...originalModule,
    useK8sWatchResource: jest.fn(),
  };
});

describe('useApplicationRoutes', () => {
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

  it('should return routes for given application', async () => {
    mockUseK8sWatchResource.mockReturnValue([mockRoutes, true]);
    const { result } = renderHook(() => useApplicationRoutes('new-application'));
    const [routes, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(routes.length).toEqual(1);
    expect(routes).toEqual([mockRoutes[0]]);
  });

  it('should return empty array if no routes exist for given application', async () => {
    mockUseK8sWatchResource.mockReturnValue([mockRoutes, true]);
    const { result } = renderHook(() => useApplicationRoutes('some-random-app'));
    const [routes, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(routes.length).toEqual(0);
    expect(routes).toEqual([]);
  });
});
