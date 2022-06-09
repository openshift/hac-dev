import { k8sCreateResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  createComponentDetectionQuery,
  initiateAccessTokenBinding,
} from '../../../utils/create-utils';
import {
  mapDetectedComponents,
  useAccessCheck,
  useAccessTokenBindingAuth,
  useComponentDetection,
} from '../utils';
import { mockCDQ, mockMappedComponents } from './../__data__/mock-cdq';

import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
  initiateAccessTokenBinding: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

jest.mock('formik', () => ({
  useFormikContext: () => ({ setFieldValue: jest.fn() }),
}));

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;
const instantiateAccessBindingMock = initiateAccessTokenBinding as jest.Mock;
const createResourceMock = k8sCreateResource as jest.Mock;

describe('useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    const { waitForNextUpdate } = renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'test-app', {
        reference: 'dev',
        contextDir: '/',
        isMultiComponent: true,
        authSecret: 'token',
      }),
    );

    await waitForNextUpdate();

    expect(createCDQMock).toHaveBeenCalled();
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://github.com/test/repo',
      '',
      true,
      'token',
      '/',
      'dev',
    );
  });

  it('should not create CDQ when source is not available', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() =>
      useComponentDetection('', 'test-app', {
        reference: '',
        contextDir: '/',
        isMultiComponent: false,
      }),
    );

    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should call useK8sWatchHook with empty object if cdqName is null', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() =>
      useComponentDetection('', 'test-app', {
        reference: '',
        contextDir: '/',
        isMultiComponent: false,
      }),
    );

    expect(useK8sWatchMock).toHaveBeenCalledWith(null);
    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should create new CDQ if source changes', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    let source = 'https://github.com/test/repo';
    const { rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection(source, 'test-app', {
        reference: 'dev',
        contextDir: '/',
        isMultiComponent: false,
      }),
    );
    source = 'https://example.com/test/repo';
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://github.com/test/repo',
      '',
      false,
      undefined,
      '/',
      'dev',
    );

    await waitForNextUpdate();

    rerender();

    await waitForNextUpdate();

    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://example.com/test/repo',
      '',
      false,
      undefined,
      '/',
      'dev',
    );
  });
});

describe('utils', () => {
  it('should map detected component values', () => {
    const mappedComponents = mapDetectedComponents(mockCDQ.status.componentDetected as any);
    expect(mappedComponents).toEqual(mockMappedComponents);
  });

  it('should add sample suffix in the name for samples', () => {
    const mappedComponents = mapDetectedComponents(mockCDQ.status.componentDetected as any, true);
    expect(mappedComponents[0].name).toEqual('nodejs-sample');
  });
});

describe('useAccessTokenBindingAuth', () => {
  it('should return loaded false if source is not present but loaded is true', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    const { result } = renderHook(() => useAccessTokenBindingAuth(undefined));
    expect(result.current[0]).toBe(undefined);
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded false if source is present but loaded is false', async () => {
    useK8sWatchMock.mockReturnValue([{}, false, null]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessTokenBindingAuth('test-source'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toBe(undefined);
    expect(result.current[1]).toBe(false);
  });

  it('should return loaded true if source is present and loaded is true', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessTokenBindingAuth('test-source'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toBe(undefined);
    expect(result.current[1]).toBe(true);
  });

  it('should return valid authurl when source is present and accessbinding is loaded', async () => {
    useK8sWatchMock.mockReturnValue([
      { status: { oAuthUrl: 'https://test-app.auth.svc.cluster.local/oauth/token', phase: '' } },
      true,
      null,
    ]);
    instantiateAccessBindingMock.mockReturnValue(
      Promise.resolve({ metadata: { name: 'test-binding' } }),
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useAccessTokenBindingAuth('test-source'),
    );
    await act(async () => await waitForNextUpdate());
    expect(result.current[0]).toBe('https://test-app.auth.svc.cluster.local/oauth/token');
    expect(result.current[1]).toBe(true);
  });
});

describe('useAccessCheck', () => {
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
