import * as React from 'react';
import { useBuildPipelines, useComponents } from '../../../../../../hooks';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  getRunStatusComponent,
  groupToPipelineNode,
  resourceToPipelineNode,
  worstWorkflowStatus,
} from '../utils/node-utils';
import { updateParallelNodeWidths } from '../utils/visualization-utils';

export const useAppComponentsNodes = (
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

  const componentNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes = components.length
      ? components.map((component) =>
          resourceToPipelineNode(
            component,
            WorkflowNodeType.COMPONENT,
            previousTasks,
            getRunStatusComponent(component, buildPipelines),
          ),
        )
      : [
          emptyPipelineNode(
            'no-components',
            'No components set',
            WorkflowNodeType.COMPONENT,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [buildPipelines, components, previousTasks]);

  const componentGroup: WorkflowNodeModel<WorkflowNodeModelData> = React.useMemo(
    () =>
      allResourcesLoaded
        ? groupToPipelineNode(
            'components',
            'Components',
            WorkflowNodeType.COMPONENT,
            previousTasks,
            expanded,
            expanded ? componentNodes?.map((c) => c.id) : undefined,
            componentNodes,
            components,
            worstWorkflowStatus(componentNodes),
          )
        : undefined,
    [allResourcesLoaded, componentNodes, components, expanded, previousTasks],
  );

  const componentTasks = React.useMemo(
    () =>
      expanded && componentNodes?.length
        ? componentNodes.map((c) => c.id)
        : [componentGroup?.id ?? ''],
    [componentGroup?.id, componentNodes, expanded],
  );

  return [componentNodes, componentGroup, componentTasks, allResourcesLoaded];
};
