import { k8sCreateResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import { initiateAccessTokenBinding } from '../../../../utils/create-utils';
import { useAccessCheck, useAccessTokenBinding } from '../auth-utils';

import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
}));

jest.mock('../../../../utils/create-utils', () => ({
  initiateAccessTokenBinding: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

jest.mock('formik', () => ({
  useFormikContext: () => ({ setFieldValue: jest.fn() }),
}));

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const instantiateAccessBindingMock = initiateAccessTokenBinding as jest.Mock;
const createResourceMock = k8sCreateResource as jest.Mock;

describe('Auth Utils: useAccessTokenBinding', () => {
  it('should return loaded false if source is not present but loaded is true', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    const { result } = renderHook(() => useAccessTokenBinding(undefined));
    expect(result.current[0]).toStrictEqual({ oAuthUrl: undefined, accessTokenName: undefined });
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded false if source is present but loaded is false', async () => {
    useK8sWatchMock.mockReturnValue([{}, false, null]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() => useAccessTokenBinding('test-source'));
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toStrictEqual({ oAuthUrl: undefined, accessTokenName: undefined });
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded true if source is present and loaded is true', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() => useAccessTokenBinding('test-source'));
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toStrictEqual({ oAuthUrl: undefined, accessTokenName: undefined });
    expect(result.current[1]).toBe(true);
  });

  it('should return valid authurl when source is present and accessbinding is loaded', async () => {
    useK8sWatchMock.mockReturnValue([
      {
        status: {
          oAuthUrl: 'https://test-app.auth.svc.cluster.local/oauth/token',
          phase: '',
          linkedAccessTokenName: 'test-token',
        },
      },
      true,
      null,
    ]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() => useAccessTokenBinding('test-source'));
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toStrictEqual({
      oAuthUrl: 'https://test-app.auth.svc.cluster.local/oauth/token',
      accessTokenName: 'test-token',
    });
    expect(result.current[1]).toBe(true);
  });
});

describe('Auth Utils: useAccessCheck', () => {
  const defaultMockData = {
    accessibility: undefined,
    isGit: false,
    isRepoAccessible: undefined,
    serviceProvider: undefined,
  };
  it('should return loaded false if source is not present but loaded is true', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    const { result } = renderHook(() => useAccessCheck(undefined, 'mock-dependency'));
    expect(result.current[0]).toEqual(defaultMockData);
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded false if source is present but loaded is false', async () => {
    useK8sWatchMock.mockReturnValue([{}, false, null]);
    createResourceMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-access-check' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessCheck('test-source', 'mock-dependency'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toEqual(defaultMockData);
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded true if source is present and loaded is true', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createResourceMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-access-check' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessCheck('test-source', 'mock-dependency'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toEqual(defaultMockData);
    expect(result.current[1]).toBe(true);
  });

  it('should return valid data when source is present and AccessCheck is loaded', async () => {
    useK8sWatchMock.mockReturnValue([
      {
        status: {
          accessible: true,
          repoType: 'git',
          serviceProvider: 'github',
          accessibility: 'public',
        },
      },
      true,
      null,
    ]);
    createResourceMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-access-check' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessCheck('test-source', 'mock-dependency'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toEqual({
      accessibility: 'public',
      isGit: true,
      isRepoAccessible: true,
      serviceProvider: 'github',
    });
    expect(result.current[1]).toBe(true);
  });
});
