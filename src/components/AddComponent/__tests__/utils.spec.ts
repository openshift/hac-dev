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

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;

describe('useComponentDetection', () => {
  afterEach(jest.resetAllMocks);

  it('creates CDQ when source is provided', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() =>
      useComponentDetection('https://github.com/test/repo', 'test-app', true, 'token'),
    );

    expect(createCDQMock).toHaveBeenCalledTimes(1);
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

    renderHook(() => useComponentDetection('', 'test-app'));

    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });

  it('should call useK8sWatchHook with empty object if cdqName is null', () => {
    useK8sWatchMock.mockReturnValue([{}, true, null]);
    createCDQMock.mockResolvedValue({ metadata: { name: 'test-cdq' } });

    renderHook(() => useComponentDetection('', 'test-app'));
    expect(useK8sWatchMock).toHaveBeenCalledWith(null);
    expect(createCDQMock).toHaveBeenCalledTimes(0);
  });
});
