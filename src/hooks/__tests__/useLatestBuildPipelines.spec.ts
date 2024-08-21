import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../__data__/pipelinerun-data';
import { useLatestBuildPipelines } from '../useLatestBuildPipelines';
import { useTRPipelineRuns } from '../useTektonResults';

jest.mock('../useTektonResults');

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;

const componentNames = ['devfile-sample-node'];
const componentNames2 = ['devfile-sample-node', 'devfile-sample-node-2'];

describe('useLatestBuildPipelines', () => {
  it('should return empty array', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false, undefined]);
    const { result } = renderHook(() =>
      useLatestBuildPipelines('test-ns', 'test-pipelinerun', componentNames),
    );

    expect(result.current).toEqual([[], false, undefined]);
  });

  it('should return build pipelines', () => {
    useK8sWatchResourceMock.mockReturnValue([
      [testPipelineRuns[DataState.RUNNING]],
      true,
      undefined,
    ]);
    useTRPipelineRunsMock.mockReturnValue([[], true, undefined, undefined]);
    const { result } = renderHook(() =>
      useLatestBuildPipelines('test-ns', 'test-pipelinerun', componentNames),
    );

    const [pipelineRuns, loaded] = result.current;
    expect(loaded).toBe(true);
    expect(pipelineRuns.map((tr) => tr.metadata?.name)).toEqual(['test-caseqfvdj']);
  });

  it('should get more build pipelines when necessary', () => {
    const getNextPageMock = jest.fn();
    useK8sWatchResourceMock.mockReturnValue([
      [testPipelineRuns[DataState.RUNNING]],
      true,
      undefined,
    ]);
    useTRPipelineRunsMock.mockReturnValue([[], true, undefined, getNextPageMock]);
    const { result } = renderHook(() =>
      useLatestBuildPipelines('test-ns', 'test-pipelinerun', componentNames2),
    );

    const [pipelineRuns, loaded] = result.current;
    expect(loaded).toBe(false);
    expect(pipelineRuns.map((tr) => tr.metadata?.name)).toEqual(['test-caseqfvdj']);
    expect(getNextPageMock).toHaveBeenCalled();
  });
});
