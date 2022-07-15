import {
  ComponentFactory,
  GraphComponent,
  LayoutFactory,
  ModelKind,
  Graph,
  withPanZoom,
  PipelineDagreLayout,
  SpacerNode,
} from '@patternfly/react-topology';
import { NodeType, PipelineLayout } from './const';
import WorkflowEdge from './edges/WorkflowEdge';
import WorkflowNode from './nodes/WorkflowNode';
import { getLayoutData } from './utils/visualization-utils';

export const componentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.edge:
      return WorkflowEdge;
    case ModelKind.node:
      switch (type) {
        case NodeType.WORKFLOW_NODE:
          return WorkflowNode;
        case NodeType.SPACER_NODE:
          return SpacerNode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

export const layoutFactory: LayoutFactory = (layout: PipelineLayout, graph: Graph) => {
  switch (layout) {
    case PipelineLayout.DAGRE_VIEWER:
      return new PipelineDagreLayout(graph, {
        ...getLayoutData(layout),
      });
    default:
      return undefined;
  }
};
