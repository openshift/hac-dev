import { useK8sWatchResource, k8sDeleteResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { createComponentDetectionQuery } from '../../../../utils/create-utils';
import { useComponentDetection } from '../cdq-utils';

import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  k8sCreateResource: jest.fn(),
  k8sDeleteResource: jest.fn(),
}));

jest.mock('../../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;

describe('CDQ Utils: useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    const { waitForNextUpdate } = renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'test-app', 'token', '/', 'dev'),
    );

    await waitForNextUpdate();

    expect(createCDQMock).toHaveBeenCalled();
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
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

    renderHook(() => useComponentDetection('', 'test-app', null, '/', ''));

    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should call useK8sWatchHook with empty object if cdqName is null', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', 'test-app', null, '/', ''));

    expect(useK8sWatchMock).toHaveBeenCalledWith(null);
    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should create new CDQ if source changes', async () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    let source = 'https://github.com/test/repo';
    const { rerender, waitForNextUpdate } = renderHook(() =>
      useComponentDetection(source, 'test-app', undefined, '/', 'dev'),
    );

    source = 'https://example.com/test/repo';
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
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
      'test-app',
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
      useComponentDetection('https://github.com/test/repo', 'test-app', 'token', '/', 'dev'),
    );
    await waitForNextUpdate();
    unmount();
    waitFor(() => expect(k8sDeleteResource).toHaveBeenCalled());
  });
});
