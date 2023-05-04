import {
  useK8sWatchResource,
  k8sGetResource,
  k8sDeleteResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { createComponentDetectionQuery } from '../../../../utils/create-utils';
import { detectComponents, useComponentDetection } from '../cdq-utils';
import {
  mockCDQ,
  mockDetectedComponent,
  mockEmptyCDQ,
  mockFailedCDQ,
} from './../__data__/mock-cdq';

import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  k8sDeleteResource: jest.fn(),
  k8sGetResource: jest.fn(),
  getActiveWorkspace: jest.fn(),
}));

jest.mock('../../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;
const getResourceMock = k8sGetResource as jest.Mock;

describe('CDQ Utils: useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    const { waitForNextUpdate } = renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'token', '/', 'dev'),
    );

    await waitForNextUpdate();

    expect(createCDQMock).toHaveBeenCalled();
    expect(createCDQMock).toHaveBeenCalledWith(
      'https://github.com/test/repo',
      '',
      'token',
      '/',
      'dev',
    );
  });

  it('should not create CDQ when source is not available', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', null, '/', ''));

    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should call useK8sWatchHook with empty object if cdqName is null', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', null, '/', ''));

    expect(useK8sWatchMock).toHaveBeenCalledWith(null);
    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should create new CDQ if source changes', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    let source = 'https://github.com/test/repo';
    const { rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection(source, undefined, '/', 'dev'),
    );

    source = 'https://example.com/test/repo';
    expect(createCDQMock).toHaveBeenCalledWith(
      'https://github.com/test/repo',
      '',
      undefined,
      '/',
      'dev',
    );

    await waitForNextUpdate();

    rerender();

    await waitForNextUpdate();

    expect(createCDQMock).toHaveBeenCalledWith(
      'https://example.com/test/repo',
      '',
      undefined,
      '/',
      'dev',
    );
  });

  it('should should delete created CDQ on unmount', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    const { waitFor, waitForNextUpdate, unmount } = renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'token', '/', 'dev'),
    );
    await waitForNextUpdate();
    unmount();
    waitFor(() => expect(k8sDeleteResource).toHaveBeenCalled());
  });

  it('should return detection loaded when CDQ status changes to complete', async () => {
    useK8sWatchMock.mockReturnValueOnce([{}, true, null]).mockReturnValue([mockCDQ, true, null]);
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      spec: {
        git: { url: 'https://github.com/nodeshift-starters/devfile-sample.git' },
      },
    });

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection(
        'https://github.com/nodeshift-starters/devfile-sample.git',
        undefined,
        '/',
        'dev',
      ),
    );

    expect(result.current).toStrictEqual([undefined, false, undefined]);

    rerender();

    await waitForNextUpdate();

    expect(result.current).toStrictEqual([mockDetectedComponent, true, undefined]);
  });

  it('should stop detection & return error when detection fails with error status', async () => {
    useK8sWatchMock
      .mockReturnValueOnce([{}, true, null])
      .mockReturnValue([mockFailedCDQ, true, null]);
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      spec: {
        git: {
          url: 'https://github.com/openshift/dynamic-plugin-sdk/tree/main/packages/sample-app',
        },
      },
    });

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection(
        'https://github.com/openshift/dynamic-plugin-sdk/tree/main/packages/sample-app',
        undefined,
        '/',
        'dev',
      ),
    );

    expect(result.current).toStrictEqual([undefined, false, undefined]);

    rerender();

    await waitForNextUpdate();

    expect(result.current).toStrictEqual([undefined, true, 'Error when cloning repository']);
  });

  it('should stop detection & return error when detection fails with ok status', async () => {
    useK8sWatchMock
      .mockReturnValueOnce([{}, true, null])
      .mockReturnValue([mockEmptyCDQ, true, null]);
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      spec: {
        git: {
          url: 'https://github.com/example/empty-repo',
        },
      },
    });

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection('https://github.com/example/empty-repo', undefined, '/', 'dev'),
    );

    expect(result.current).toStrictEqual([undefined, false, undefined]);

    rerender();

    await waitForNextUpdate();

    expect(result.current).toStrictEqual([undefined, true, undefined]);
  });
});

describe('detectComponents', () => {
  it('should poll cdq until components are detected', async () => {
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      status: { conditions: [{ type: 'Completed', status: 'False' }] },
    });
    getResourceMock
      .mockResolvedValueOnce({
        metadata: { name: 'test-cdq' },
        status: { conditions: [{ type: 'Completed', status: 'False' }] },
      })
      .mockResolvedValueOnce({
        metadata: { name: 'test-cdq' },
        status: { conditions: [{ type: 'Completed', status: 'True' }], componentDetected: true },
      });
    await detectComponents('https:://github.com/test/repo', 'app', 'ns');
    expect(getResourceMock).toHaveBeenCalledTimes(2);
  });

  it('should throw error if components were not detected', () => {
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      status: {
        conditions: [
          { type: 'Completed', status: 'True', reson: 'Error', message: 'Could not detect!' },
        ],
      },
    });
    expect(detectComponents('https:://github.com/test/repo', 'app', 'ns')).rejects.toThrowError(
      'Could not detect!',
    );
  });

  it('should delete cdq after components are detected', async () => {
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      status: { conditions: [{ type: 'Completed', status: 'True' }], componentDetected: true },
    });
    await detectComponents('https:://github.com/test/repo', 'app', 'ns');
    () => expect(k8sDeleteResource).toHaveBeenCalled();
  });

  it('should delete cdq even if components were not detected', async () => {
    createCDQMock.mockResolvedValue({
      metadata: { name: 'test-cdq' },
      status: {
        conditions: [
          { type: 'Completed', status: 'True', reson: 'Error', message: 'Could not detect!' },
        ],
      },
    });
    expect(detectComponents('https:://github.com/test/repo', 'app', 'ns')).rejects.toThrowError();
    expect(k8sDeleteResource).toHaveBeenCalled();
  });
});
