import { renderHook } from '@testing-library/react-hooks';
import { useScanResults } from '../useScanResults';
import { useTRTaskRuns } from '../useTektonResults';

jest.mock('../useTektonResults', () => ({
  useTRTaskRuns: jest.fn(() => [[], true]),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useTRTaskRunsMock = useTRTaskRuns as jest.Mock;

describe('useScanResults', () => {
  it('returns null if results are not fetched', () => {
    useTRTaskRunsMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => useScanResults('test'));
    expect(result.current).toEqual([null, false]);
  });

  it('returns null if scan results are not found in taskrun', () => {
    useTRTaskRunsMock.mockReturnValue([[], true]);
    const { result } = renderHook(() => useScanResults('test'));
    expect(result.current).toEqual([null, true]);
  });

  it('returns scan results if taskrun is found', () => {
    useTRTaskRunsMock.mockReturnValue([
      [
        {
          metadata: {
            labels: { 'tekton.dev/pipelineRun': 'test', 'tekton.dev/pipelineTask': 'clair-scan' },
          },
          spec: { taskRef: { name: 'clair-scan' } },
          status: {
            taskResults: [
              {
                name: 'CVE_SCAN_RESULT',
                value: '{ "vulnerabilities": { "critical": 1, "high": 2, "medium": 3, "low": 4 } }',
              },
            ],
          },
        },
      ],
      true,
    ]);
    const { result } = renderHook(() => useScanResults('test'));
    expect(result.current).toEqual([
      { vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } },
      true,
    ]);
  });
});
