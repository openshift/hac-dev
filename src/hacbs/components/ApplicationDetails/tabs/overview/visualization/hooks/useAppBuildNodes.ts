import * as React from 'react';
import { PipelineRunKind } from '../../../../../../../shared/components/pipeline-run-logs/types';
import { BUILD_COMPONENT_LABEL } from '../../../../../../../utils/const';
import { useBuildPipelines, useComponents } from '../../../../../../hooks';
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
] => {
  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [buildPipelines, buildPipelinesLoaded] = useBuildPipelines(namespace, applicationName);
  const allResourcesLoaded: boolean = componentsLoaded && buildPipelinesLoaded;

  const latestBuilds = React.useMemo(() => {
    if (!allResourcesLoaded) {
      return [];
    }
    return components.reduce((acc, component) => {
      const latestBuild = buildPipelines
        .filter((p) => p.metadata.labels?.[BUILD_COMPONENT_LABEL] === component.metadata.name)
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
  }, [allResourcesLoaded, buildPipelines, components]);

  const buildNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes =
      components.length && latestBuilds.length
        ? components.map((component) => getBuildNodeForComponent(component, latestBuilds))
        : [emptyPipelineNode('no-builds', 'No builds yet', WorkflowNodeType.BUILD, previousTasks)];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [previousTasks, components, latestBuilds]);

  const buildGroup = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'builds',
            'Builds',
            WorkflowNodeType.BUILD,
            previousTasks,
            expanded,
            expanded ? buildNodes?.map((c) => c.id) : undefined,
            buildNodes,
            latestBuilds,
            worstWorkflowStatus(buildNodes),
          )
        : undefined,
    [allResourcesLoaded, buildNodes, previousTasks, latestBuilds, expanded],
  );

  const buildTasks = React.useMemo(
    () => (expanded && buildNodes?.length ? buildNodes.map((c) => c.id) : [buildGroup?.id ?? '']),
    [buildGroup?.id, buildNodes, expanded],
  );

  return [buildNodes, buildGroup, buildTasks, allResourcesLoaded];
};
