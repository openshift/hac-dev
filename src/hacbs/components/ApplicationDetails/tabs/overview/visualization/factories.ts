import {
  ComponentFactory,
  DefaultTaskGroup,
  GraphComponent,
  ModelKind,
  SpacerNode,
} from '@patternfly/react-topology';
import { NodeType } from './const';
import WorkflowEdge from './edges/WorkflowEdge';
import WorkflowNode from './nodes/WorkflowNode';

export const componentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return GraphComponent;
    case ModelKind.edge:
      return WorkflowEdge;
    case ModelKind.node:
      switch (type) {
        case NodeType.WORKFLOW_NODE:
          return WorkflowNode;
        case NodeType.WORKFLOW_GROUP:
          return DefaultTaskGroup;
        case NodeType.SPACER_NODE:
          return SpacerNode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};
