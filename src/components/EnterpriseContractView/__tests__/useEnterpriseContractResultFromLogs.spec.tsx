import { commonFetchText, getK8sResourceURL } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { useTaskRuns } from '../../../hooks/useTaskRuns';
import { PodModel } from '../../../models/pod';
import {
  mockEnterpriseContractJSON,
  mockEnterpriseContractUIData,
  mockEnterpriseContractYaml,
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
    commonFetchText: jest.fn(),
  };
});

const mockCommmonFetchText = commonFetchText as jest.Mock;
const mockUseTaskRuns = useTaskRuns as jest.Mock;

describe('useEnterpriseContractResultFromLogs', () => {
  beforeEach(() => {
    mockCommmonFetchText.mockResolvedValue(mockEnterpriseContractYaml);
    mockUseTaskRuns.mockReturnValue([
      [
        {
          status: {
            podName: 'pod-acdf',
          },
        },
      ],
      true,
      undefined,
    ]);
  });

  it('should fetch EC yaml and parse yaml to json', () => {
    const opts = {
      ns: 'test-ns',
      name: 'pod-acdf',
      path: 'log',
      queryParams: {
        container: 'step-validate',
        follow: 'true',
      },
    };
    renderHook(() => useEnterpriseContractResultFromLogs('dummy-abcd'));
    expect(mockCommmonFetchText).toHaveBeenCalled();
    expect(mockCommmonFetchText).toHaveBeenCalledWith(getK8sResourceURL(PodModel, undefined, opts));
  });

  it('should parse valid rules to json', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnterpriseContractResultFromLogs('dummy-abcd'),
    );
    await waitForNextUpdate();
    expect(mockCommmonFetchText).toHaveBeenCalled();
    expect(result.current[0][0].successes.length).toEqual(1);
    expect(result.current[0][0].violations.length).toEqual(1);
    expect(result.current[0][0].warnings).toEqual(undefined);
  });

  it('should filter out all 404 image url components from EC results', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnterpriseContractResultFromLogs('dummy-abcd'),
    );
    await waitForNextUpdate();
    const [ecResult, loaded] = result.current;
    expect(mockCommmonFetchText).toHaveBeenCalled();
    expect(loaded).toBe(true);
    expect(ecResult.findIndex((ec) => ec.name === 'devfile-sample-1jik')).toEqual(-1);
  });
});

describe('mapEnterpriseContractResultData', () => {
  it('should map to data consumable by UI', () => {
    const uiData = mapEnterpriseContractResultData([
      mockEnterpriseContractJSON.components[2],
    ] as any);
    expect(uiData.length).toEqual(2);
    expect(uiData[0].status).toEqual('Failed');
    expect(uiData.findIndex((u) => u.status === 'Warning')).toEqual(-1);
    expect(uiData).toEqual(mockEnterpriseContractUIData);
  });
});

describe('useEnterpriseContractResults', () => {
  beforeEach(() => {
    mockCommmonFetchText.mockResolvedValue(mockEnterpriseContractYaml);
    mockUseTaskRuns.mockReturnValue([
      [
        {
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
    const { result, waitForNextUpdate } = renderHook(() =>
      useEnterpriseContractResults('dummy-abcd'),
    );
    expect(result.current[0]).toEqual(undefined);
    expect(result.current[1]).toEqual(false);
    await waitForNextUpdate();
    expect(result.current[0]).toEqual(mockEnterpriseContractUIData);
    expect(result.current[1]).toEqual(true);
  });
});
