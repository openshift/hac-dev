import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { usePipelineRunsWithStatus } from '..';
import { mockTaskRuns } from '../../components/PipelineRunDetailsView/__data__/mockVisualizationData';
import { useTaskRuns } from '../useTaskRuns';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../useTaskRuns', () => ({
  useTaskRuns: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTaskRunsMock = useTaskRuns as jest.Mock;

describe('usePipelineRunsWithStatus', () => {
  it('should return empty list if resources are not loaded', () => {
    useTaskRunsMock.mockReturnValue([null, false]);
    useK8sWatchResourceMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => usePipelineRunsWithStatus('test-ns', 'test-app'));
    expect(result.current).toEqual([[], false, undefined]);
  });

  it('should return undefined status if taskruns are not loaded', () => {
    useTaskRunsMock.mockReturnValue([mockTaskRuns, false]);
    useK8sWatchResourceMock.mockReturnValue([[{}], true]);
    const { result } = renderHook(() => usePipelineRunsWithStatus('test-ns', 'test-app'));
    expect(result.current[0]).toEqual([{ scanResults: undefined }]);
  });

  it('should return status if resources are loaded', () => {
    useTaskRunsMock.mockReturnValue([mockTaskRuns, true]);
    useK8sWatchResourceMock.mockReturnValue([
      [{ metadata: { name: 'human-resources-clkq-on-pull-request-xn5nd' } }],
      true,
    ]);
    const { result } = renderHook(() => usePipelineRunsWithStatus('test-ns', 'test-app'));
    expect(result.current[0]).toEqual([
      expect.objectContaining({
        scanResults: { vulnerabilities: { critical: 1, high: 1, low: 1, medium: 1 } },
      }),
    ]);
  });
});
