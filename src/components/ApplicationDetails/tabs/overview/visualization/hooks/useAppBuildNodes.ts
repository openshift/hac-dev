import * as React from 'react';
import { PipelineRunLabel } from '../../../../../../consts/pipelinerun';
import { useBuildPipelines } from '../../../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../../../hooks/useComponents';
import { PipelineRunKind } from '../../../../../../types';
import { runStatus } from '../../../../../../utils/pipeline-utils';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  getBuildNodeForComponent,
  groupToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppBuildNodes = (
  namespace: string,
  applicationName: string,
  previousTasks: string[],
  expanded: boolean,
): [
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
  group: WorkflowNodeModel<WorkflowNodeModelData>,
  tasks: string[],
  loaded: boolean,
  errors: unknown[],
] => {
  const [components, componentsLoaded, componentsError] = useComponents(namespace, applicationName);
  // TODO this is inefficient to get all builds just to find the latest component builds
  const [buildPipelines, buildPipelinesLoaded, buildPipelinesError] = useBuildPipelines(
    namespace,
    applicationName,
    null,
    true,
  );
  const allResourcesLoaded: boolean = componentsLoaded && buildPipelinesLoaded;
  const allErrors: unknown[] = [componentsError, buildPipelinesError].filter((e) => !!e);

  const latestBuilds = React.useMemo(() => {
    if (!allResourcesLoaded || allErrors.length > 0) {
      return [];
    }
    return components.reduce((acc, component) => {
      const latestBuild = buildPipelines
        .filter((p) => p.metadata.labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name)
        ?.sort?.(
          (a, b) =>
            new Date(b.metadata.creationTimestamp).getTime() -
            new Date(a.metadata.creationTimestamp).getTime(),
        )?.[0];
      if (latestBuild) {
        acc.push(latestBuild);
      }
      return acc;
    }, [] as PipelineRunKind[]);
  }, [allResourcesLoaded, buildPipelines, components, allErrors]);

  const buildNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes =
      components.length && latestBuilds.length
        ? components.map((component) =>
            getBuildNodeForComponent(component, applicationName, latestBuilds),
          )
        : [
            emptyPipelineNode(
              'no-builds',
              applicationName,
              'No builds yet',
              WorkflowNodeType.BUILD,
              previousTasks,
            ),
          ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [components, latestBuilds, applicationName, previousTasks]);

  const buildGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'builds',
            applicationName,
            latestBuilds?.length ? 'Builds' : 'No builds yet',
            WorkflowNodeType.BUILD,
            previousTasks,
            expanded,
            expanded ? buildNodes?.map((c) => c.id) : undefined,
            components.length && latestBuilds.length ? buildNodes : [],
            latestBuilds,
            components.length && buildNodes?.[0].id === 'no-builds'
              ? runStatus.NeedsMerge
              : worstWorkflowStatus(buildNodes),
          )
        : undefined,
    [
      allResourcesLoaded,
      applicationName,
      latestBuilds,
      previousTasks,
      expanded,
      buildNodes,
      components.length,
    ],
  );

  const buildTasks = React.useMemo(
    () => (expanded && buildNodes?.length ? buildNodes.map((c) => c.id) : [buildGroup?.id ?? '']),
    [buildGroup?.id, buildNodes, expanded],
  );

  return [buildNodes, buildGroup, buildTasks, allResourcesLoaded, allErrors];
};
