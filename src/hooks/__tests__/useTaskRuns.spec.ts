import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { testTaskRuns } from '../../components/TaskRunListView/__data__/mock-TaskRun-data';
import { useTaskRuns } from '../useTaskRuns';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('useTaskRuns', () => {
  it('returns undefined if results are not fetched', () => {
    useK8sWatchResourceMock.mockReturnValue([null, false, undefined]);
    const { result } = renderHook(() => useTaskRuns('test-ns'));

    expect(result.current).toEqual([undefined, false, undefined]);
  });

  it('should return sorted taskruns', () => {
    useK8sWatchResourceMock.mockReturnValue([testTaskRuns, true, undefined]);
    const { result } = renderHook(() => useTaskRuns('test-ns', 'test-pipelinerun', 'test-task'));

    const [taskRuns, loaded] = result.current;
    expect(loaded).toBe(true);
    expect(taskRuns.map((tr) => tr.metadata?.name)).toEqual(['example-234', 'example']);
  });

  it('should sort the taskruns based on the completionTime', () => {
    const taskRuns = [
      testTaskRuns[0],
      {
        ...testTaskRuns[1],
        metadata: {
          ...testTaskRuns[1].metadata,
          name: 'example-task-running',
        },
        status: {
          ...testTaskRuns[1].status,
          completionTime: undefined,
        },
      },
    ];

    useK8sWatchResourceMock.mockReturnValue([taskRuns, true, undefined]);
    const { result } = renderHook(() => useTaskRuns('test-ns', 'test-pipelinerun', 'test-task'));

    const [tRuns, loaded] = result.current;
    expect(loaded).toBe(true);
    expect(tRuns.map((tr) => tr.metadata?.name)).toEqual(['example-234', 'example-task-running']);
  });
});
