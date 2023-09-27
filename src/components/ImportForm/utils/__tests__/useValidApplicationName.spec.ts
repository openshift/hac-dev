import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { ApplicationKind } from '../../../../types';
import { incrementNameCount, useValidApplicationName } from '../useValidApplicationName';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  getActiveWorkspace: jest.fn(),
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

  it('returns the repo name based on given git url', () => {
    const { result } = renderHook(() =>
      useValidApplicationName('https://github.com/testapp/testrepo'),
    );
    expect(result.current[0]).toBe('testrepo');
  });

  it('should handle extra space in the start and end of the git url ', () => {
    const { result } = renderHook(() =>
      useValidApplicationName('  https://github.com/testapp/testrepo  '),
    );
    expect(result.current[0]).toBe('testrepo');
  });
});

describe('incrementNameCount', () => {
  it('should return with preffered application name', () => {
    expect(incrementNameCount(testAppData as ApplicationKind[], 'new-app')).toBe('new-app');
  });

  it('should return next available incremented name', () => {
    testAppData.push({ metadata: { name: 'new-app' } });
    expect(incrementNameCount(testAppData as ApplicationKind[], 'new-app')).toBe('new-app-1');
  });

  it('should fallback to base name', () => {
    expect(incrementNameCount(testAppData as ApplicationKind[])).toBe('my-app-3');
  });
});
