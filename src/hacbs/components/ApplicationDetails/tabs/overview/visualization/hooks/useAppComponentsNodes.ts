import * as React from 'react';
import { useBuildPipelines } from '../../../../../../hooks/useBuildPipelines';
import { useComponents } from '../../../../../../hooks/useComponents';
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
  errors: unknown[],
] => {
  const [components, componentsLoaded, componentsError] = useComponents(namespace, applicationName);
  const [buildPipelines, buildPipelinesLoaded, buildPipelinesError] = useBuildPipelines(
    namespace,
    applicationName,
  );
  const allResourcesLoaded: boolean = componentsLoaded && buildPipelinesLoaded;
  const allErrors: unknown[] = [componentsError, buildPipelinesError].filter((e) => !!e);

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
      allResourcesLoaded && allErrors.length === 0
        ? groupToPipelineNode(
            'components',
            components?.length ? 'Components' : 'No components set',
            WorkflowNodeType.COMPONENT,
            previousTasks,
            expanded,
            expanded ? componentNodes?.map((c) => c.id) : undefined,
            componentNodes,
            components,
            worstWorkflowStatus(componentNodes),
          )
        : undefined,
    [allResourcesLoaded, componentNodes, components, expanded, previousTasks, allErrors],
  );

  const componentTasks = React.useMemo(
    () =>
      expanded && componentNodes?.length
        ? componentNodes.map((c) => c.id)
        : [componentGroup?.id ?? ''],
    [componentGroup?.id, componentNodes, expanded],
  );

  return [componentNodes, componentGroup, componentTasks, allResourcesLoaded, allErrors];
};
