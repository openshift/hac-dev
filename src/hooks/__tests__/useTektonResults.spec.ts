/* eslint-disable max-nested-callbacks */

import { commonFetchText } from '@openshift/dynamic-plugin-sdk-utils';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  TektonResultsOptions,
  getPipelineRuns,
  getTaskRuns,
  RecordsList,
  getTaskRunLogOld,
} from '../../utils/tekton-results';
import { useTRPipelineRuns, useTRTaskRunLog, useTRTaskRuns } from '../useTektonResults';

jest.mock('../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../utils/tekton-results');

jest.mock('../../utils/tekton-results', () => {
  const actual = jest.requireActual('../../utils/tekton-results');
  return {
    ...actual,
    getTaskRunLogOld: jest.fn(),
    getPipelineRuns: jest.fn(),
    getTaskRuns: jest.fn(),
  };
});
jest.mock('@openshift/dynamic-plugin-sdk-utils');

const mockResponse = [
  [{ metadata: { name: 'first' } }, { metadata: { name: 'second' } }],
  { nextPageToken: 'next-token' },
] as [any[], RecordsList];

const mockResponseNext = [
  [{ metadata: { name: 'third' } }, { metadata: { name: 'fourth' } }],
  {},
] as [any[], RecordsList];

const mockTaskRun = {
  apiVersion: 'v1Alpha1',
  spec: {},
  kind: 'TaskRun',
  metadata: { uid: 'test-id' },
};

const mockResponseLogs = 'test-log';

const getPipelineRunsMock = getPipelineRuns as jest.Mock;
const getTaskRunsMock = getTaskRuns as jest.Mock;
const getTaskRunLogOldMock = getTaskRunLogOld as jest.Mock;
const commonFetchTextMock = commonFetchText as unknown as jest.Mock;

describe('useTektonResults', () => {
  beforeEach(() => {
    commonFetchTextMock.mockReturnValueOnce(Promise.resolve(mockResponseLogs));
    jest.clearAllMocks();
  });

  [
    {
      describeTitle: 'useTRPipelineRuns',
      name: 'pipeline',
      getRunsMock: getPipelineRunsMock,
      useTestHook: useTRPipelineRuns,
    },
    {
      describeTitle: 'useTRTaskRuns',
      name: 'task',
      getRunsMock: getTaskRunsMock,
      useTestHook: useTRTaskRuns,
    },
  ].forEach(({ describeTitle, name, getRunsMock, useTestHook }) => {
    describe(describeTitle, () => {
      it(`should not attempt to get ${name} runs`, () => {
        renderHook(() => useTestHook(null));
        expect(getRunsMock).not.toHaveBeenCalled();
      });

      it(`should return ${name} runs`, async () => {
        getRunsMock.mockReturnValue(mockResponseNext);
        const { result, waitFor } = renderHook(() => useTestHook('test-ns'));
        expect(getRunsMock).toHaveBeenCalledWith('test-ws', 'test-ns', undefined, null, undefined);
        expect(result.current).toEqual([[], false, undefined, undefined]);
        await waitFor(() => result.current[1]);
        expect(result.current).toEqual([mockResponseNext[0], true, undefined, undefined]);
      });

      it('should return pass along filters and cache key', async () => {
        getRunsMock.mockClear();
        getRunsMock.mockReturnValue(mockResponseNext);
        const filter: TektonResultsOptions = {
          filter: 'foo=bar',
        };
        const { result, waitFor } = renderHook(() =>
          useTestHook('test-ns', filter, 'test-cache-key'),
        );
        expect(getRunsMock).toHaveBeenCalledWith(
          'test-ws',
          'test-ns',
          filter,
          null,
          'test-cache-key',
        );
        expect(result.current).toEqual([[], false, undefined, undefined]);
        await waitFor(() => result.current[1]);
        expect(result.current).toEqual([mockResponseNext[0], true, undefined, undefined]);
      });

      it('should return pass along cache key', async () => {
        getRunsMock.mockClear();
        getRunsMock.mockReturnValue(mockResponseNext);
        const { result, waitFor } = renderHook(() =>
          useTestHook('test-ns', undefined, 'test-cache-key'),
        );
        expect(getRunsMock).toHaveBeenCalledWith(
          'test-ws',
          'test-ns',
          undefined,
          null,
          'test-cache-key',
        );
        expect(result.current).toEqual([[], false, undefined, undefined]);
        await waitFor(() => result.current[1]);
        expect(result.current).toEqual([mockResponseNext[0], true, undefined, undefined]);
      });

      it(`should return function to get next ${name} runs`, async () => {
        getRunsMock.mockReturnValueOnce(mockResponse).mockReturnValueOnce(mockResponseNext);
        const { result, waitFor } = renderHook(() => useTestHook('test-ns'));
        expect(getRunsMock).toHaveBeenCalledWith('test-ws', 'test-ns', undefined, null, undefined);
        expect(result.current).toEqual([[], false, undefined, undefined]);
        await waitFor(() => result.current[1]);
        expect(result.current).toEqual([mockResponse[0], true, undefined, expect.any(Function)]);

        getRunsMock.mockClear();

        // call to get next set
        act(() => {
          expect(result.current[3]()).toBe(true);
        });

        expect(getRunsMock).toHaveBeenCalledWith(
          'test-ws',
          'test-ns',
          undefined,
          'next-token',
          undefined,
        );

        // subsequent calls should fail
        expect(result.current[3]()).toBe(false);

        await waitFor(() => result.current[0].length > 2);

        expect(result.current).toEqual([
          [...mockResponse[0], ...mockResponseNext[0]],
          true,
          undefined,
          undefined,
        ]);
      });

      it('should return error when exception thrown', async () => {
        const error = {};
        getRunsMock.mockImplementation(() => {
          throw error;
        });
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(getRunsMock).toHaveBeenCalledWith('test-ws', 'test-ns', undefined, null, undefined);
        expect(result.current).toEqual([[], true, error, undefined]);
      });

      it('should return error when exception thrown when getting next page', async () => {
        getRunsMock.mockReturnValueOnce(mockResponse);
        const { result, waitFor } = renderHook(() => useTestHook('test-ns'));
        expect(getRunsMock).toHaveBeenCalledWith('test-ws', 'test-ns', undefined, null, undefined);
        expect(result.current).toEqual([[], false, undefined, undefined]);
        await waitFor(() => result.current[1]);
        expect(result.current).toEqual([mockResponse[0], true, undefined, expect.any(Function)]);

        getRunsMock.mockClear();

        const error = {};
        getRunsMock.mockImplementation(() => {
          throw error;
        });

        act(() => {
          expect(result.current[3]()).toBe(true);
        });

        expect(getRunsMock).toHaveBeenCalledWith(
          'test-ws',
          'test-ns',
          undefined,
          'next-token',
          undefined,
        );
        expect(result.current).toEqual([mockResponse[0], true, error, undefined]);
      });
    });
  });

  describe('useTRTaskRunLog', () => {
    it('should not attempt to get task run log', () => {
      renderHook(() => useTRTaskRunLog(null, null, null));
      expect(commonFetchTextMock).not.toHaveBeenCalled();

      renderHook(() =>
        useTRTaskRunLog('test-ns', null, {
          apiVersion: 'v1Alpha1',
          spec: {},
          kind: 'TaskRun',
          metadata: { uid: 'test-id' },
        }),
      );
      expect(commonFetchTextMock).not.toHaveBeenCalled();

      renderHook(() =>
        useTRTaskRunLog(null, 'pipelinerun-uid', {
          apiVersion: 'v1Alpha1',
          spec: {},
          kind: 'TaskRun',
          metadata: { uid: 'test-id' },
        }),
      );
      expect(commonFetchTextMock).not.toHaveBeenCalled();

      renderHook(() => useTRTaskRunLog('test-ns', 'pipelinerun-uid', null));
      expect(commonFetchTextMock).not.toHaveBeenCalled();
    });

    it('should return task run log', async () => {
      commonFetchTextMock.mockImplementation(() => mockResponseLogs);
      renderHook(() => useTRTaskRunLog('test-ns', 'pipelinerun-uid', mockTaskRun));
      expect(commonFetchTextMock).toHaveBeenCalled();
      expect(commonFetchTextMock).toHaveBeenCalledWith(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/pipelinerun-uid/logs/test-id',
      );
    });

    it('should return error when exception thrown by both FetchLogs', async () => {
      commonFetchTextMock.mockRejectedValue({});
      getTaskRunLogOldMock.mockRejectedValue({});
      const { result } = renderHook(() =>
        useTRTaskRunLog('test-ns', 'pipelinerun-uid', {
          apiVersion: 'v1Alpha1',
          spec: {},
          kind: 'TaskRun',
          metadata: { uid: 'test-id' },
        }),
      );
      expect(commonFetchTextMock).toHaveBeenCalledWith(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/pipelinerun-uid/logs/test-id',
      );
      expect(result.current).toEqual([null, false, undefined]);
    });
  });
});
