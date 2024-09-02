import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../__data__/pipelinerun-data';
import { useBuildPipelines } from '../useBuildPipelines';
import { useTRPipelineRuns } from '../useTektonResults';

jest.mock('../useTektonResults');

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;

describe('useBuildPipelines', () => {
  it('should return empty array', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false, undefined]);
    const { result } = renderHook(() => useBuildPipelines('test-ns', 'test-pipelinerun', null));

    expect(result.current).toEqual([[], false, undefined, undefined]);
  });

  it('should return build pipelines', () => {
    useK8sWatchResourceMock.mockReturnValue([
      [testPipelineRuns[DataState.RUNNING]],
      true,
      undefined,
    ]);
    useTRPipelineRunsMock.mockReturnValue([[], true, undefined, undefined]);
    const { result } = renderHook(() =>
      useBuildPipelines('test-ns', 'test-pipelinerun', null, false),
    );

    const [pipelineRuns, loaded] = result.current;
    expect(loaded).toBe(true);
    expect(pipelineRuns.map((tr) => tr.metadata?.name)).toEqual(['test-caseqfvdj']);
  });
});
