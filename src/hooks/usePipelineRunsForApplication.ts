import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { useNamespace } from '../components/NamespacedPage/NamespacedPage';
import { ComponentGroupVersionKind } from '../models';
import { PipelineRunGroupVersionKind } from '../shared';
import { PipelineRunKind } from '../shared/components/pipeline-run-logs/types';
import { ComponentKind } from '../types';
import { BUILD_APPLICATION_LABEL, BUILD_COMPONENT_LABEL } from '../utils/const';

export const useLatestPipelineRunForComponent = (
  component: ComponentKind,
): PipelineRunKind | undefined => {
  const { namespace } = useNamespace();
  const [pipelineRuns, prLoaded, prError] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
  });
  return React.useMemo(() => {
    if (prLoaded && !prError) {
      return pipelineRuns
        ?.filter?.(
          (plr) =>
            plr.metadata.labels[BUILD_COMPONENT_LABEL] === component.metadata.name &&
            plr.metadata.labels[BUILD_APPLICATION_LABEL] === component.spec.application,
        )
        ?.sort?.(
          (a, b) =>
            new Date(b.metadata.creationTimestamp).getTime() -
            new Date(a.metadata.creationTimestamp).getTime(),
        )?.[0];
    }
    return undefined;
  }, [component.metadata.name, component.spec.application, pipelineRuns, prError, prLoaded]);
};

export const usePipelineRunsForApplication = (
  applicationName: string,
): [{ [componentName: string]: PipelineRunKind[] } | undefined, boolean, any] => {
  const { namespace } = useNamespace();
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
              plr.metadata.labels[BUILD_COMPONENT_LABEL] === currComponent.metadata.name &&
              plr.metadata.labels[BUILD_APPLICATION_LABEL] === currComponent.spec.application,
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
