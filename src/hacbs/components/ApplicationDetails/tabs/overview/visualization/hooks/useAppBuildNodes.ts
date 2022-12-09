import * as React from 'react';
import { PipelineRunLabel } from '../../../../../../../hacbs/consts/pipelinerun';
import { PipelineRunKind } from '../../../../../../../shared/components/pipeline-run-logs/types';
import { useBuildPipelines } from '../../../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../../../hooks/useComponents';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  getBuildNodeForComponent,
  groupToPipelineNode,
  NEEDS_MERGE_STATUS,
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
  const [buildPipelines, buildPipelinesLoaded, buildPipelinesError] = useBuildPipelines(
    namespace,
    applicationName,
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
            latestBuilds?.length ? 'Builds' : 'No builds yet',
            WorkflowNodeType.BUILD,
            previousTasks,
            expanded,
            expanded ? buildNodes?.map((c) => c.id) : undefined,
            buildNodes,
            latestBuilds,
            components.length && buildNodes?.[0].id === 'no-builds'
              ? NEEDS_MERGE_STATUS
              : worstWorkflowStatus(buildNodes),
          )
        : undefined,
    [allResourcesLoaded, previousTasks, expanded, buildNodes, latestBuilds, components.length],
  );

  const buildTasks = React.useMemo(
    () => (expanded && buildNodes?.length ? buildNodes.map((c) => c.id) : [buildGroup?.id ?? '']),
    [buildGroup?.id, buildNodes, expanded],
  );

  return [buildNodes, buildGroup, buildTasks, allResourcesLoaded, allErrors];
};
