import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useValidApplicationName } from '../useValidApplicationName';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

const testAppData = [
  { metadata: { name: 'my-app' } },
  { metadata: { name: 'my-app-1' } },
  { metadata: { name: 'my-app-2' } },
];

describe('useValidApplicationName', () => {
  it('returns next available incremented name', () => {
    watchResourceMock.mockReturnValue([testAppData, true]);
    const { result } = renderHook(() => useValidApplicationName());
    expect(result.current[0]).toBe('my-app-3');
  });
});
