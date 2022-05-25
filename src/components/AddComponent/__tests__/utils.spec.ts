import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { useComponentDetection } from '../utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;

describe('useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'test-app', {
        reference: '',
        contextDir: '/',
        isMultiComponent: true,
        authSecret: 'token',
      }),
    );

    expect(createCDQMock).toHaveBeenCalled();
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://github.com/test/repo',
      '',
      true,
      'token',
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

  it('should create new CDQ if source changes', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    let source = 'https://github.com/test/repo';
    const { rerender } = renderHook(() =>
      useComponentDetection(source, 'test-app', {
        reference: '',
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
    );
    rerender();
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://example.com/test/repo',
      '',
      false,
      undefined,
    );
  });
});
