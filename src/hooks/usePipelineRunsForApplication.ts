import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { PipelineRunLabel, PipelineRunType } from '../consts/pipelinerun';
import { ComponentGroupVersionKind, PipelineRunGroupVersionKind } from '../models';
import { ComponentKind, PipelineRunKind, TaskRunGroupVersionKind, TaskRunKind } from '../types';
import { useWorkspaceInfo } from '../utils/workspace-context-utils';

export const usePipelineRun = (
  namespace: string,
  pipelineRunName: string,
): [PipelineRunKind, boolean, unknown] => {
  const [pipelineRun, loaded, error] = useK8sWatchResource<PipelineRunKind>({
    groupVersionKind: PipelineRunGroupVersionKind,
    name: pipelineRunName,
    namespace,
  });
  return React.useMemo(() => {
    if (loaded && !error && pipelineRun.metadata.deletionTimestamp) {
      return [null, loaded, { code: 404 }];
    }
    return [pipelineRun, loaded, error];
  }, [pipelineRun, loaded, error]);
};

export const useTaskRun = (
  namespace: string,
  taskRunName: string,
): [TaskRunKind, boolean, unknown] => {
  const [taskRun, loaded, error] = useK8sWatchResource<TaskRunKind>({
    groupVersionKind: TaskRunGroupVersionKind,
    name: taskRunName,
    namespace,
  });
  return React.useMemo(() => {
    if (loaded && !error && taskRun.metadata.deletionTimestamp) {
      return [null, loaded, { code: 404 }];
    }
    return [taskRun, loaded, error];
  }, [taskRun, loaded, error]);
};

export const useLatestPipelineRunForComponent = (
  namespace: string,
  component: ComponentKind,
): [PipelineRunKind | undefined, boolean, any] => {
  const [pipelineRuns, prLoaded, prError] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
        [PipelineRunLabel.COMPONENT]: component.metadata.name,
      },
    },
  });
  const latestRun = React.useMemo(() => {
    if (prLoaded && !prError) {
      return pipelineRuns?.sort?.(
        (a, b) =>
          new Date(b.metadata.creationTimestamp).getTime() -
          new Date(a.metadata.creationTimestamp).getTime(),
      )?.[0];
    }
    return undefined;
  }, [pipelineRuns, prError, prLoaded]);
  return [latestRun, prLoaded, prError];
};

export const usePipelineRunsForApplication = (
  applicationName: string,
): [{ [componentName: string]: PipelineRunKind[] } | undefined, boolean, any] => {
  const { namespace } = useWorkspaceInfo();
  const [pipelineRuns, prLoaded, prError] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
  });
  const [components, cLoaded, cError] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });

  const componentsForApplication = React.useMemo(
    () => (cLoaded ? components.filter((c) => c.spec.application === applicationName) : []),
    [components, cLoaded, applicationName],
  );

  const loaded = prLoaded && cLoaded;
  const error = prError || cError;

  const pipelineRunsForEachComponent = React.useMemo(() => {
    if (loaded && !error) {
      return componentsForApplication.reduce((acc, currComponent) => {
        const prs = pipelineRuns
          ?.filter?.(
            (plr) =>
              plr.metadata.labels[PipelineRunLabel.COMPONENT] === currComponent.metadata.name &&
              plr.metadata.labels[PipelineRunLabel.APPLICATION] === currComponent.spec.application,
          )
          ?.sort?.(
            (a, b) =>
              new Date(b.metadata.creationTimestamp).getTime() -
              new Date(a.metadata.creationTimestamp).getTime(),
          );
        acc[currComponent.metadata.name] = prs;
        return acc;
      }, {});
    }
    return undefined;
  }, [componentsForApplication, error, loaded, pipelineRuns]);

  return [pipelineRunsForEachComponent, loaded, error];
};

export const useLatestPipelineRunsForApplication = (applicationName: string) => {
  const [compsPRs, loaded, error] = usePipelineRunsForApplication(applicationName);

  const pipelineRuns = React.useMemo(() => {
    if (loaded && !error && compsPRs) {
      return Object.keys(compsPRs).map((componentName) => {
        return compsPRs[componentName]?.[0];
      });
    }
    return undefined;
  }, [compsPRs, error, loaded]);

  return [pipelineRuns, loaded, error];
};
