import * as React from 'react';
import { useComponents } from '../../../../../../hooks/useComponents';
import { WorkflowNodeModel, WorkflowNodeModelData, WorkflowNodeType } from '../types';
import {
  emptyPipelineNode,
  groupToPipelineNode,
  resourceToPipelineNode,
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

  const componentNodes: WorkflowNodeModel<WorkflowNodeModelData>[] = React.useMemo(() => {
    const nodes = components.length
      ? components.map((component) =>
          resourceToPipelineNode(
            component,
            applicationName,
            WorkflowNodeType.COMPONENT,
            previousTasks,
          ),
        )
      : [
          emptyPipelineNode(
            'no-components',
            applicationName,
            'No components set',
            WorkflowNodeType.COMPONENT,
            previousTasks,
          ),
        ];
    updateParallelNodeWidths(nodes);
    return nodes;
  }, [applicationName, components, previousTasks]);

  const componentGroup: WorkflowNodeModel<WorkflowNodeModelData> = React.useMemo(
    () =>
      componentsLoaded && !componentsError
        ? groupToPipelineNode(
            'components',
            applicationName,
            components?.length ? 'Components' : 'No components set',
            WorkflowNodeType.COMPONENT,
            previousTasks,
            expanded,
            expanded ? componentNodes?.map((c) => c.id) : undefined,
            components.length ? componentNodes : [],
            components,
          )
        : undefined,
    [
      componentsLoaded,
      componentsError,
      applicationName,
      components,
      previousTasks,
      expanded,
      componentNodes,
    ],
  );

  const componentTasks = React.useMemo(
    () =>
      expanded && componentNodes?.length
        ? componentNodes.map((c) => c.id)
        : [componentGroup?.id ?? ''],
    [componentGroup?.id, componentNodes, expanded],
  );

  return [
    componentNodes,
    componentGroup,
    componentTasks,
    componentsLoaded,
    componentsError ? [componentsError] : [],
  ];
};
