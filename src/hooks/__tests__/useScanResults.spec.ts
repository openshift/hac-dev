import { renderHook } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../__data__/pipelinerun-data';
import { usePLRScanResults, usePLRVulnerabilities, useScanResults } from '../useScanResults';
import { useTRTaskRuns } from '../useTektonResults';

jest.mock('../useTektonResults', () => ({
  useTRTaskRuns: jest.fn(() => [[], true]),
}));

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

const useTRTaskRunsMock = useTRTaskRuns as jest.Mock;

const taskRunData = [
  {
    metadata: {
      labels: { 'tekton.dev/pipelineRun': 'test', 'tekton.dev/pipelineTask': 'clair-scan' },
    },
    spec: { taskRef: { name: 'clair-scan' } },
    status: {
      results: [
        {
          name: 'CVE_SCAN_RESULT',
          value: '{ "vulnerabilities": { "critical": 1, "high": 2, "medium": 3, "low": 4 } }',
        },
      ],
    },
  },
  {
    metadata: {
      labels: { 'tekton.dev/pipelineRun': 'test2', 'tekton.dev/pipelineTask': 'clair-scan' },
    },
    spec: { taskRef: { name: 'clair-scan' } },
    status: {
      results: [
        {
          name: 'CLAIR_SCAN_RESULT',
          value: '{ "vulnerabilities": { "critical": 5, "high": 2, "medium": 0, "low": 4 } }',
        },
      ],
    },
  },
];

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
    useTRTaskRunsMock.mockReturnValue([[taskRunData[0]], true]);
    const { result } = renderHook(() => useScanResults('test'));
    expect(result.current).toEqual([
      { vulnerabilities: { critical: 1, high: 2, medium: 3, low: 4 } },
      true,
    ]);
  });
});

describe('usePLRScanResults', () => {
  it('returns null if results are not fetched', () => {
    useTRTaskRunsMock.mockReturnValue([null, false]);
    const { result } = renderHook(() => usePLRScanResults(['test1']));
    expect(result.current).toEqual([null, false, [], undefined]);
  });

  it('returns null if scan results are not found in taskrun', () => {
    useTRTaskRunsMock.mockReturnValue([[], true]);
    const { result } = renderHook(() => usePLRScanResults(['test2']));
    expect(result.current).toEqual([null, true, [], undefined]);
  });

  it('returns error if scan results API is failing', () => {
    const badGatewayError = new Error('502: bad gateway error');
    useTRTaskRunsMock.mockReturnValue([[], true, badGatewayError]);
    const { result } = renderHook(() => usePLRScanResults(['test2']));
    expect(result.current).toEqual([null, true, [], badGatewayError]);
  });

  it('returns scan results if taskrun is found', () => {
    useTRTaskRunsMock.mockReturnValue([taskRunData, true]);
    const { result } = renderHook(() => usePLRScanResults(['test', 'test2']));
    const [scanResultsMap, loaded] = result.current;
    expect(Object.keys(scanResultsMap)).toEqual(['test', 'test2']);
    const vulnerabilities = Object.values(scanResultsMap);

    const [map1] = vulnerabilities[0];
    expect(map1.vulnerabilities).toEqual({
      critical: 1,
      high: 2,
      low: 4,
      medium: 3,
    });
    const [map2] = vulnerabilities[1];
    expect(map2.vulnerabilities).toEqual({
      critical: 5,
      high: 2,
      low: 4,
      medium: 0,
    });
    expect(loaded).toBe(true);
  });
});

describe('usePLRVulnerabilities', () => {
  it('returns default values if taskruns are not available', () => {
    useTRTaskRunsMock.mockReturnValue([null, false]);
    const { result } = renderHook(() =>
      usePLRVulnerabilities([testPipelineRuns[DataState.SUCCEEDED]]),
    );
    expect(result.current).toEqual({ fetchedPipelineRuns: [], vulnerabilities: {} });
  });

  it('returns vulnerabilities when scan taskrun are available', () => {
    useTRTaskRunsMock.mockReturnValue([[taskRunData[0]], true]);

    const { result } = renderHook(() =>
      usePLRVulnerabilities([testPipelineRuns[DataState.SUCCEEDED]]),
    );
    expect(result.current.vulnerabilities).toEqual(
      expect.objectContaining({
        test: expect.arrayContaining([
          { vulnerabilities: { critical: 1, high: 2, low: 4, medium: 3 } },
        ]),
      }),
    );
  });
});
