import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { createComponentDetectionQuery } from '../../../utils/create-utils';
import { mapDetectedComponents, useComponentDetection } from '../utils';
import { mockCDQ, mockMappedComponents } from './../__data__/mock-cdq';

import '@testing-library/jest-dom';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  commonFetch: jest.fn(),
}));

jest.mock('../../../utils/create-utils', () => ({
  createComponentDetectionQuery: jest.fn(),
}));

jest.mock('lodash/debounce', () => (fn: Function) => fn);

jest.mock('formik', () => ({
  useFormikContext: () => ({ setFieldValue: jest.fn() }),
}));

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const createCDQMock = createComponentDetectionQuery as jest.Mock;

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
