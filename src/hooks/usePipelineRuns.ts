import * as React from 'react';
import {
  K8sGroupVersionKind,
  K8sResourceCommon,
  Selector,
  useK8sWatchResource,
} from '@openshift/dynamic-plugin-sdk-utils';
import { differenceBy, uniqBy } from 'lodash-es';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { PipelineRunGroupVersionKind } from '../models';
import { useDeepCompareMemoize } from '../shared';
import { PipelineRunKind, TaskRunGroupVersionKind, TaskRunKind } from '../types';
import { getCommitSha } from '../utils/commits-utils';
import { pipelineRunStatus, runStatus } from '../utils/pipeline-utils';
import { EQ } from '../utils/tekton-results';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';
import { GetNextPage, useTRPipelineRuns, useTRTaskRuns } from './useTektonResults';

const useRuns = <Kind extends K8sResourceCommon>(
  groupVersionKind: K8sGroupVersionKind,
  namespace: string,
  options?: {
    selector?: Selector;
    limit?: number;
    name?: string;
  },
): [Kind[], boolean, unknown, GetNextPage] => {
  const { workspace } = useWorkspaceInfo();
  const etcdRunsRef = React.useRef<Kind[]>([]);
  const optionsMemo = useDeepCompareMemoize(options);
  const limit = optionsMemo?.limit;
  const isList = !optionsMemo?.name;
  // do not include the limit when querying etcd because result order is not sorted
  const watchOptions = React.useMemo(() => {
    // reset cached runs as the options have changed
    etcdRunsRef.current = [];
    return namespace
      ? {
          groupVersionKind,
          namespace,
          isList,
          selector: optionsMemo?.selector,
          name: optionsMemo?.name,
        }
      : null;
  }, [groupVersionKind, namespace, optionsMemo, isList]);

  const [resources, loaded, error] = useK8sWatchResource(watchOptions);
  // if a pipeline run was removed from etcd, we want to still include it in the return value without re-querying tekton-results
  const etcdRuns = React.useMemo(
    () => (isList ? resources : loaded && !error ? [resources] : []) as Kind[],
    [isList, resources, loaded, error],
  );

  const runs = React.useMemo(() => {
    if (!etcdRuns) {
      return etcdRuns;
    }
    let value = etcdRunsRef.current
      ? [
          ...etcdRuns,
          // identify the runs that were removed
          ...differenceBy(etcdRunsRef.current, etcdRuns, (plr) => plr.metadata.name),
        ]
      : [...etcdRuns];
    value.sort((a, b) => b.metadata.creationTimestamp.localeCompare(a.metadata.creationTimestamp));
    if (limit && limit < value.length) {
      value = value.slice(0, limit);
    }
    return value;
  }, [etcdRuns, limit]);

  // cache the last set to identify removed runs
  etcdRunsRef.current = runs;

  // Query tekton results if there's no limit or we received less items from etcd than the current limit
  const queryTr =
    !limit ||
    (workspace && namespace && ((runs && loaded && optionsMemo.limit > runs.length) || error));

  const trOptions: typeof optionsMemo = React.useMemo(() => {
    if (optionsMemo?.name) {
      const { name, ...rest } = optionsMemo;
      return {
        ...rest,
        filter: EQ('data.metadata.name', name),
      };
    }
    return optionsMemo;
  }, [optionsMemo]);

  // tekton-results includes items in etcd, therefore options must use the same limit
  // these duplicates will later be de-duped
  const [trResources, trLoaded, trError, trGetNextPage] = (
    groupVersionKind === PipelineRunGroupVersionKind ? useTRPipelineRuns : useTRTaskRuns
  )(queryTr ? namespace : null, trOptions) as [Kind[], boolean, unknown, GetNextPage];

  return React.useMemo(() => {
    const rResources =
      runs && trResources
        ? uniqBy([...runs, ...trResources], (r) => r.metadata.name)
        : runs || trResources;

    return [
      rResources,
      namespace
        ? queryTr
          ? isList
            ? // return loaded only if both sources have loaded
              trLoaded && loaded
            : // when searching by name, loading fails if we have no result
              !!rResources?.[0]
          : isList
          ? loaded
          : // when searching by name, loading fails if we have no result
            !!rResources?.[0]
        : false,
      namespace
        ? queryTr
          ? isList
            ? trError || error
            : // when searching by name, return an error if we have no result
              trError || (trLoaded && !trResources.length ? error : undefined)
          : error
        : undefined,
      trGetNextPage,
    ];
  }, [
    runs,
    loaded,
    error,
    trResources,
    trLoaded,
    trError,
    trGetNextPage,
    namespace,
    queryTr,
    isList,
  ]);
};

export const usePipelineRuns = (
  namespace: string,
  options?: {
    selector?: Selector;
    limit?: number;
  },
): [PipelineRunKind[], boolean, unknown, GetNextPage] =>
  useRuns<PipelineRunKind>(PipelineRunGroupVersionKind, namespace, options);

export const useTaskRuns = (
  namespace: string,
  options?: {
    selector?: Selector;
    limit?: number;
  },
): [TaskRunKind[], boolean, unknown, GetNextPage] =>
  useRuns<TaskRunKind>(TaskRunGroupVersionKind, namespace, options);

export const useLatestBuildPipelineRunForComponent = (
  namespace: string,
  componentName: string,
): [PipelineRunKind, boolean, unknown] => {
  const result = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            [PipelineRunLabel.COMPONENT]: componentName,
          },
        },
        limit: 1,
      }),
      [componentName],
    ),
  ) as unknown as [PipelineRunKind[], boolean, unknown];

  return React.useMemo(() => [result[0]?.[0], result[1], result[2]], [result]);
};

export const useLatestSuccessfulBuildPipelineRunForComponent = (
  namespace: string,
  componentName: string,
): [PipelineRunKind, boolean, unknown] => {
  const [pipelines, loaded, error] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
            [PipelineRunLabel.COMPONENT]: componentName,
          },
        },
      }),
      [componentName],
    ),
  ) as unknown as [PipelineRunKind[], boolean, unknown];

  return React.useMemo(() => {
    if (!loaded || error) {
      return [null, loaded, error];
    }
    return [
      pipelines
        .filter((pipeline) => pipelineRunStatus(pipeline) === runStatus.Succeeded)
        .sort((a, b) =>
          b.metadata.creationTimestamp.localeCompare(a.metadata.creationTimestamp),
        )[0],
      loaded,
      error,
    ];
  }, [pipelines, loaded, error]);
};

export const usePipelineRunsForCommit = (
  namespace: string,
  applicationName: string,
  commit: string,
): [PipelineRunKind[], boolean, unknown] => {
  // TODO filter by label and annotation (?)
  const [results, loaded, error] = usePipelineRuns(
    namespace && applicationName && commit ? namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
          },
        },
        // arbitrary large limit since the number of pipeline runs for a commit should be limited
        limit: 100,
      }),
      [applicationName],
    ),
  );

  const pipelineRuns = React.useMemo(
    () =>
      (results ?? [])
        .filter((plr) => getCommitSha(plr) === commit)
        .sort((a, b) => b.metadata.creationTimestamp.localeCompare(a.metadata.creationTimestamp)),
    [commit, results],
  );

  return React.useMemo(() => [pipelineRuns, loaded, error], [pipelineRuns, loaded, error]);
};

export const usePipelineRun = (
  namespace: string,
  pipelineRunName: string,
): [PipelineRunKind, boolean, unknown] => {
  const result = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        name: pipelineRunName,
        limit: 1,
      }),
      [pipelineRunName],
    ),
  ) as unknown as [PipelineRunKind[], boolean, unknown];

  return React.useMemo(
    () => [result[0]?.[0], result[1], result[0]?.[0] ? undefined : result[2]],
    [result],
  );
};

export const useTaskRun = (
  namespace: string,
  taskRunName: string,
): [TaskRunKind, boolean, unknown] => {
  const result = useTaskRuns(
    namespace,
    React.useMemo(
      () => ({
        name: taskRunName,
        limit: 1,
      }),
      [taskRunName],
    ),
  ) as unknown as [TaskRunKind[], boolean, unknown];

  return React.useMemo(
    () => [result[0]?.[0], result[1], result[0]?.[0] ? undefined : result[2]],
    [result],
  );
};
