/* eslint-disable max-nested-callbacks */
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { renderHook } from '@testing-library/react-hooks';
import { PipelineRunGroupVersionKind, TaskRunGroupVersionKind } from '../../models';
import {
  useLatestBuildPipelineRunForComponent,
  usePipelineRun,
  usePipelineRuns,
  usePipelineRunsForCommit,
  useTaskRun,
  useTaskRuns,
} from '../usePipelineRuns';
import { useTRPipelineRuns, useTRTaskRuns } from '../useTektonResults';

jest.mock('@openshift/dynamic-plugin-sdk-utils');
jest.mock('../useTektonResults');

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const useTRPipelineRunsMock = useTRPipelineRuns as jest.Mock;
const useTRTaskRunsMock = useTRTaskRuns as jest.Mock;

const resultMock = [
  { metadata: { name: 'first', creationTimestamp: '2023-04-11T19:36:25Z' } },
  { metadata: { name: 'second', creationTimestamp: '2022-04-11T19:36:25Z' } },
];

const resultMock2 = [
  { metadata: { name: 'third', creationTimestamp: '2021-04-11T19:36:25Z' } },
  { metadata: { name: 'fourth', creationTimestamp: '2020-04-11T19:36:25Z' } },
];

describe('usePipelineRuns', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  [
    {
      describeTitle: 'usePipelineRuns',
      useTRRunsMock: useTRPipelineRunsMock,
      useTestHook: usePipelineRuns,
      groupVersionKind: PipelineRunGroupVersionKind,
    },
    {
      describeTitle: 'useTaskRuns',
      useTRRunsMock: useTRTaskRunsMock,
      useTestHook: useTaskRuns,
      groupVersionKind: TaskRunGroupVersionKind,
    },
  ].forEach(({ describeTitle, useTRRunsMock, useTestHook, groupVersionKind }) => {
    describe(describeTitle, () => {
      it('should query etcd and tekton results simultaneously', () => {
        useK8sWatchResourceMock.mockReturnValue([[], false]);
        renderHook(() =>
          useTestHook('test-ns', {
            selector: {
              foo: 'bar',
            },
          }),
        );
        expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
          groupVersionKind,
          namespace: 'test-ns',
          isList: true,
          selector: {
            foo: 'bar',
          },
        });
        expect(useTRRunsMock).toHaveBeenCalledWith('test-ns', { selector: { foo: 'bar' } });
      });

      it('should query etcd only when the limit was achieved', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock, true]);
        const { result } = renderHook(() =>
          useTestHook('test-ns', {
            limit: 1,
            selector: {
              foo: 'bar',
            },
          }),
        );
        expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
          groupVersionKind,
          namespace: 'test-ns',
          isList: true,
          selector: {
            foo: 'bar',
          },
        });
        expect(useTRRunsMock).toHaveBeenCalledWith(null, {
          limit: 1,
          selector: {
            foo: 'bar',
          },
        });

        expect(result.current).toEqual([[resultMock[0]], true, undefined, undefined]);
      });

      it('should query etcd followed by tekton results when there is a limit', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock, false]);
        const { rerender } = renderHook(() =>
          useTestHook('test-ns', {
            limit: 10,
            selector: {
              foo: 'bar',
            },
          }),
        );
        expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
          groupVersionKind,
          namespace: 'test-ns',
          isList: true,
          selector: {
            foo: 'bar',
          },
        });
        expect(useTRRunsMock).toHaveBeenCalledWith(null, {
          limit: 10,
          selector: {
            foo: 'bar',
          },
        });

        useTRRunsMock.mockClear();

        // re-render after updating the return value from etcd
        useK8sWatchResourceMock.mockReturnValue([[], true]);
        rerender();

        expect(useTRRunsMock).toHaveBeenCalledWith('test-ns', {
          limit: 10,
          selector: {
            foo: 'bar',
          },
        });
      });

      it('should return error from etcd', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([[], false, error]);
        useTRRunsMock.mockReturnValue([[], false]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([[], false, error, undefined]);
      });

      it('should return error from tekton results', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([[], false]);
        useTRRunsMock.mockReturnValue([[], false, error]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([[], false, error, undefined]);
      });

      it('should return error from tekton results as priority', () => {
        const error = { code: 502 };
        const error2 = { code: 403 };
        useK8sWatchResourceMock.mockReturnValue([[], false, error]);
        useTRRunsMock.mockReturnValue([[], false, error2]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([[], false, error2, undefined]);
      });

      it('should return runs with error from tekton results', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([resultMock, true]);
        useTRRunsMock.mockReturnValue([[], false, error]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([resultMock, false, error, undefined]);
      });

      it('should return runs with error from etcd', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([[], false, error]);
        useTRRunsMock.mockReturnValue([resultMock, true]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([resultMock, false, error, undefined]);
      });

      it('should dedupe results from etcd and tekton results', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock, true]);
        useTRRunsMock.mockReturnValue([resultMock, true]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([resultMock, true, undefined, undefined]);
      });

      it('should sort etcd results by creationTimestamp', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock.slice().reverse(), true]);
        useTRRunsMock.mockReturnValue([resultMock2, true]);
        const { result } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([
          [...resultMock, ...resultMock2],
          true,
          undefined,
          undefined,
        ]);
      });

      it('should include removed results from etcd', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock2, true]);
        useTRRunsMock.mockReturnValue([[], true]);
        const { result, rerender } = renderHook(() => useTestHook('test-ns'));
        expect(result.current).toEqual([resultMock2, true, undefined, undefined]);

        useK8sWatchResourceMock.mockReturnValue([resultMock, true]);
        rerender();
        expect(result.current).toEqual([
          [...resultMock, ...resultMock2],
          true,
          undefined,
          undefined,
        ]);

        useK8sWatchResourceMock.mockReturnValue([[], true]);
        rerender();
        expect(result.current).toEqual([
          [...resultMock, ...resultMock2],
          true,
          undefined,
          undefined,
        ]);
      });
    });
  });

  describe('useLatestBuildPipelineRunForComponent', () => {
    it('should create specific selector', () => {
      useK8sWatchResourceMock.mockReturnValue([[], true, undefined]);
      useTRPipelineRunsMock.mockReturnValue([[], false, undefined]);
      const { result } = renderHook(() =>
        useLatestBuildPipelineRunForComponent('test-ns', 'sample-component'),
      );

      expect(result.current).toEqual([undefined, false, undefined]);

      expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
        groupVersionKind: PipelineRunGroupVersionKind,
        namespace: 'test-ns',
        isList: true,
        selector: {
          matchLabels: {
            'pipelines.appstudio.openshift.io/type': 'build',
            'appstudio.openshift.io/component': 'sample-component',
          },
        },
      });
      expect(useTRPipelineRunsMock).toHaveBeenCalledWith('test-ns', {
        limit: 1,
        selector: {
          matchLabels: {
            'pipelines.appstudio.openshift.io/type': 'build',
            'appstudio.openshift.io/component': 'sample-component',
          },
        },
      });
    });

    it('should return a single pipeline run', () => {
      useK8sWatchResourceMock.mockReturnValue([resultMock, true]);
      const { result } = renderHook(() =>
        useLatestBuildPipelineRunForComponent('test-ns', 'sample-component'),
      );
      expect(result.current).toEqual([resultMock[0], true, undefined]);
    });
  });

  describe('usePipelineRunsForCommit', () => {
    it('should create specific selector', () => {
      renderHook(() => usePipelineRunsForCommit('test-ns', 'test-app', 'sample-sha'));

      expect(useK8sWatchResourceMock).toHaveBeenCalledTimes(2);
      expect(useK8sWatchResourceMock.mock.calls).toEqual([
        [
          {
            groupVersionKind: PipelineRunGroupVersionKind,
            namespace: 'test-ns',
            isList: true,
            selector: {
              matchLabels: {
                'appstudio.openshift.io/application': 'test-app',
                'pipelinesascode.tekton.dev/sha': 'sample-sha',
              },
            },
          },
        ],
        [
          {
            groupVersionKind: PipelineRunGroupVersionKind,
            namespace: 'test-ns',
            isList: true,
            selector: {
              matchLabels: {
                'appstudio.openshift.io/application': 'test-app',
                'pac.test.appstudio.openshift.io/sha': 'sample-sha',
              },
            },
          },
        ],
      ]);
      expect(useTRPipelineRunsMock).toHaveBeenCalledTimes(2);
      expect(useTRPipelineRunsMock.mock.calls).toEqual([
        [
          'test-ns',
          {
            limit: 100,
            selector: {
              matchLabels: {
                'appstudio.openshift.io/application': 'test-app',
                'pipelinesascode.tekton.dev/sha': 'sample-sha',
              },
            },
          },
        ],
        [
          'test-ns',
          {
            limit: 100,
            selector: {
              matchLabels: {
                'appstudio.openshift.io/application': 'test-app',
                'pac.test.appstudio.openshift.io/sha': 'sample-sha',
              },
            },
          },
        ],
      ]);
    });

    it('should return pipeline runs', () => {
      useK8sWatchResourceMock
        .mockReturnValueOnce([resultMock, true])
        .mockReturnValueOnce([resultMock2, true]);
      useTRPipelineRunsMock.mockReturnValue([[], true]);
      const { result } = renderHook(() =>
        usePipelineRunsForCommit('test-ns', 'test-app', 'sample-sha'),
      );
      expect(result.current).toEqual([[...resultMock, ...resultMock2], true, undefined]);
    });
  });

  [
    {
      describeTitle: 'usePipelineRun',
      useTRRunsMock: useTRPipelineRunsMock,
      useTestHook: usePipelineRun,
      groupVersionKind: PipelineRunGroupVersionKind,
    },
    {
      describeTitle: 'useTaskRun',
      useTRRunsMock: useTRTaskRunsMock,
      useTestHook: useTaskRun,
      groupVersionKind: TaskRunGroupVersionKind,
    },
  ].forEach(({ describeTitle, useTRRunsMock, useTestHook, groupVersionKind }) => {
    describe(describeTitle, () => {
      it('should create specific selector', () => {
        useK8sWatchResourceMock.mockReturnValue([{}, false]);
        const { rerender } = renderHook(() => useTestHook('test-ns', 'sample-name'));

        expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
          groupVersionKind,
          namespace: 'test-ns',
          isList: false,
          name: 'sample-name',
        });
        expect(useTRRunsMock).toHaveBeenCalledWith(null, {
          limit: 1,
          filter: 'data.metadata.name == "sample-name"',
        });

        jest.clearAllMocks();

        useK8sWatchResourceMock.mockReturnValue([{}, false, { code: 502 }]);
        rerender();
        expect(useK8sWatchResourceMock).toHaveBeenCalledWith({
          groupVersionKind,
          namespace: 'test-ns',
          isList: false,
          name: 'sample-name',
        });
        expect(useTRRunsMock).toHaveBeenCalledWith('test-ns', {
          limit: 1,
          filter: 'data.metadata.name == "sample-name"',
        });
      });

      it('should return a single run', () => {
        useK8sWatchResourceMock.mockReturnValue([resultMock[0], true]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([resultMock[0], true, undefined]);
      });

      it('should return error', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([{}, true, error]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([undefined, false, error]);
      });

      it('should return a single run from tekton results', () => {
        useK8sWatchResourceMock.mockReturnValue([null, false]);
        useTRRunsMock.mockReturnValue([resultMock, true, undefined]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([resultMock[0], true, undefined]);
      });

      it('should return not loaded if we have no result', () => {
        useK8sWatchResourceMock.mockReturnValue([null, false, undefined]);
        useTRRunsMock.mockReturnValue([[], true, undefined]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([undefined, false, undefined]);
      });

      it('should return not loaded if we have no result and error', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([null, false, error]);
        useTRRunsMock.mockReturnValue([[], true, undefined]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([undefined, false, error]);
      });

      it('should return not loaded if we have no result and error from tekton results', () => {
        const error = { code: 502 };
        useK8sWatchResourceMock.mockReturnValue([null, false, {}]);
        useTRRunsMock.mockReturnValue([[], true, error]);
        const { result } = renderHook(() => useTestHook('test-ns', 'sample-name'));
        expect(result.current).toEqual([undefined, false, error]);
      });
    });
  });
});
