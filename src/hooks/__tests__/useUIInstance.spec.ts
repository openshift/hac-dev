import { renderHook } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mockLocation } from '../../utils/test-utils';
import { getInternalInstance, useSbomUrl, useUIInstance } from '../useUIInstance';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));
const chromeMock = useChrome as jest.Mock;

describe('getInternalInstance', () => {
  it('should return correct env for internal instance host', () => {
    mockLocation({ hostname: 'konflux.apps.stone-prod-p01.wcfb.p1.openshiftapps.com' });
    expect(getInternalInstance()).toEqual('prod');
    mockLocation({ hostname: 'rhtap.apps.rosa.stone-stage-p01.apys.p3.openshiftapps.com' });
    expect(getInternalInstance()).toEqual('stage');
    mockLocation({ hostname: 'abcd.com' });
    expect(getInternalInstance()).toEqual(undefined);
  });
});

describe('useUIInstance', () => {
  it('should return correct environment', () => {
    chromeMock.mockReturnValue('prod');
    mockLocation({ hostname: 'console.redhat.com/preview/application-pipeline' });
    const { result } = renderHook(() => useUIInstance());
    expect(result.current).toEqual('prod');
  });

  it('should return correct env for internal instance', () => {
    chromeMock.mockReturnValue('prod');
    mockLocation({ hostname: 'rhtap.apps.rosa.stone-stage-p01.apys.p3.openshiftapps.com' });
    const { result, rerender } = renderHook(() => useUIInstance());
    expect(result.current).toEqual('stage');
    chromeMock.mockReturnValue('qa');
    mockLocation({ hostname: 'konflux.apps.stone-prod-p01.wcfb.p1.openshiftapps.com' });
    rerender();
    expect(result.current).toEqual('prod');
  });
  it('should return correct environment when not internal instance', () => {
    chromeMock.mockReturnValue('dev');
    mockLocation({ hostname: 'not.internal.instance.com' });
    const { result } = renderHook(() => useUIInstance());
    expect(result.current).toEqual('dev');
  });
});

describe('useSbomUrl', () => {
  it('should return correct SBOM url based for prod env', () => {
    chromeMock.mockReturnValue('prod');
    const { result } = renderHook(() => useSbomUrl());
    expect(result.current('image-hash-prod')).toEqual(
      'https://atlas.devshift.net/sbom/content/image-hash-prod',
    );
  });

  it('should return correct SBOM url based for stage env', () => {
    chromeMock.mockReturnValue('stage');
    const { result } = renderHook(() => useSbomUrl());
    expect(result.current('image-hash-stage')).toEqual(
      'https://atlas.stage.devshift.net/sbom/content/image-hash-stage',
    );
  });
});
