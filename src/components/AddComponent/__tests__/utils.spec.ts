import { renderHook } from '@testing-library/react-hooks';
import { useK8sWatchResource } from '../../../dynamic-plugin-sdk';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { useComponentDetection } from '../utils';

jest.mock('../../../dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;

describe('useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'test-app', 'test-ns', true, 'token'),
    );

    expect(createCDQMock).toHaveBeenCalledTimes(1);
    expect(createCDQMock).toHaveBeenCalledWith(
      'test-app',
      'https://github.com/test/repo',
      'test-ns',
      true,
      'token',
    );
  });

  it('should not create CDQ when source is not available', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', 'test-app', 'test-ns'));

    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should call useK8sWatchHook with empty object if cdqName is null', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', 'test-app', 'test-ns'));
    expect(useK8sWatchMock).toHaveBeenCalledWith({});
    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });
});
