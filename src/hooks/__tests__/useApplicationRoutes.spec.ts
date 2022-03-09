import { renderHook } from '@testing-library/react-hooks';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { mockRoutes } from '../__data__/mock-data';
import { useApplicationRoutes } from '../useApplicationRoutes';

jest.mock('../../dynamic-plugin-sdk', () => {
  const originalModule = (jest as any).requireActual('../../dynamic-plugin-sdk');
  return {
    ...originalModule,
    useK8sWatchResource: jest.fn(),
  };
});

describe('useApplicationRoutes', () => {
  const mockUseK8sWatchResource = useK8sWatchResource as jest.Mock;

  it('should return routes for given application', async () => {
    mockUseK8sWatchResource.mockReturnValue([mockRoutes, true]);
    const { result } = renderHook(() => useApplicationRoutes('purple-mermaid-app', 'test'));
    const [routes, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(routes.length).toEqual(1);
    expect(routes).toEqual([mockRoutes[0]]);
  });

  it('should return empty array if no routes exist for given application', async () => {
    mockUseK8sWatchResource.mockReturnValue([mockRoutes, true]);
    const { result } = renderHook(() => useApplicationRoutes('some-random-app', 'test'));
    const [routes, loaded] = result.current;
    expect(loaded).toEqual(true);
    expect(routes.length).toEqual(0);
    expect(routes).toEqual([]);
  });
});
