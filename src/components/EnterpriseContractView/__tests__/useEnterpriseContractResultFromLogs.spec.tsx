import { commonFetchJSON } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useTaskRuns } from '../../../hooks/useTaskRuns';
import { getTaskRunLog } from '../../../utils/tekton-results';
import {
  mockEnterpriseContractJSON,
  mockEnterpriseContractUIData,
} from '../__data__/mockEnterpriseContractLogsJson';
import {
  mapEnterpriseContractResultData,
  useEnterpriseContractResultFromLogs,
  useEnterpriseContractResults,
} from '../useEnterpriseContractResultFromLogs';

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../hooks/useTaskRuns', () => ({
  useTaskRuns: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk-utils');
  return {
    ...actual,
    commonFetchJSON: jest.fn(),
  };
});

jest.mock('../../../utils/tekton-results', () => ({
  ...jest.requireActual('../../../utils/tekton-results'),
  getTaskRunLog: jest.fn(),
}));

const mockGetTaskRunLogs = getTaskRunLog as jest.Mock;
const mockCommmonFetchJSON = commonFetchJSON as unknown as jest.Mock;
const mockUseTaskRuns = useTaskRuns as jest.Mock;

describe('useEnterpriseContractResultFromLogs', () => {
  beforeEach(() => {
    mockCommmonFetchJSON.mockResolvedValue(mockEnterpriseContractJSON);
    mockUseTaskRuns.mockReturnValue([
      [
        {
          metadata: {
            namespace: 'test-ns',
            name: 'test-task',
          },
          status: {
            podName: 'test-pod',
          },
        },
      ],
      true,
      undefined,
    ]);
  });

  it('should parse valid rules to json', async () => {
    const { result } = renderHook(() => useEnterpriseContractResultFromLogs('test-pr'));
    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });
    expect(mockCommmonFetchJSON).toHaveBeenCalled();
    expect(result.current[0][0].successes.length).toEqual(1);
    expect(result.current[0][0].violations.length).toEqual(1);
    expect(result.current[0][0].warnings).toEqual(undefined);
  });

  it('should filter out all 404 image url components from EC results', async () => {
    const { result } = renderHook(() => useEnterpriseContractResultFromLogs('dummy-abcd'));
    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });
    const [ecResult, loaded] = result.current;
    expect(mockCommmonFetchJSON).toHaveBeenCalled();
    expect(loaded).toBe(true);
    expect(ecResult.findIndex((ec) => ec.name === 'devfile-sample-1jik')).toEqual(-1);
  });

  it('should return handle api errors', async () => {
    mockCommmonFetchJSON.mockRejectedValue(new Error('Api error'));

    const { result } = renderHook(() => useEnterpriseContractResultFromLogs('dummy-abcd'));
    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });
    const [ecResult, loaded] = result.current;
    expect(mockCommmonFetchJSON).toHaveBeenCalled();
    expect(loaded).toBe(true);
    expect(ecResult).toBeUndefined();
  });

  it('should return handle 404 error', async () => {
    mockUseTaskRuns.mockReturnValue([
      [
        {
          metadata: {
            namespace: 'asd',
            name: 'asd',
          },
          status: {
            podName: 'pod-acdf',
          },
        },
      ],
      true,
      undefined,
    ]);
    mockCommmonFetchJSON.mockRejectedValue({ code: 404 });
    mockGetTaskRunLogs.mockReturnValue(`asdfcdfadsf
    [report-json] { "components": [] }
    `);

    const { result } = renderHook(() => useEnterpriseContractResultFromLogs('dummy-abcd'));
    const [, loaded] = result.current;
    expect(mockCommmonFetchJSON).toHaveBeenCalled();
    expect(loaded).toBe(false);
    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });
    const [ec, ecLoaded] = result.current;
    expect(mockGetTaskRunLogs).toHaveBeenCalled();
    expect(ecLoaded).toBe(true);
    expect(ec).toEqual([]);
  });
});

describe('mapEnterpriseContractResultData', () => {
  it('should map to data consumable by UI', () => {
    const uiData = mapEnterpriseContractResultData([
      mockEnterpriseContractJSON.components[2],
    ] as any);

    expect(uiData.length).toEqual(2);
    expect(uiData[0].status).toEqual('Failed');
    expect(uiData[0].solution).toEqual('solution for failure');
    expect(uiData.findIndex((u) => u.status === 'Warning')).toEqual(-1);
  });

  it('should map solution data to failed results', () => {
    const uiData = mapEnterpriseContractResultData([
      mockEnterpriseContractJSON.components[2],
    ] as any);
    expect(uiData[0].status).toEqual('Failed');
    expect(uiData[0].solution).toEqual('solution for failure');
    expect(uiData).toEqual(mockEnterpriseContractUIData);
  });
});

describe('useEnterpriseContractResults', () => {
  beforeEach(() => {
    mockCommmonFetchJSON.mockResolvedValue(mockEnterpriseContractJSON);
    mockUseTaskRuns.mockReturnValue([
      [
        {
          metadata: {
            namespace: 'test-ns',
            name: 'dummy-abcd',
          },
          status: {
            podName: 'pod-acdf',
          },
        },
      ],
      true,
      undefined,
    ]);
  });

  it('should return enterprise contract results', async () => {
    const { result } = renderHook(() => useEnterpriseContractResults('dummy-abcd'));
    expect(result.current[0]).toEqual(undefined);
    expect(result.current[1]).toEqual(false);
    const initialValue = result.current;
    await waitFor(() => {
      expect(result.current).not.toBe(initialValue);
    });
    expect(result.current[0]).toEqual(mockEnterpriseContractUIData);
    expect(result.current[1]).toEqual(true);
  });
});
