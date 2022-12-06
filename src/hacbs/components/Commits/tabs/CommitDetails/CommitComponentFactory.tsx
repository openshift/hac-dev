import {
  ComponentFactory,
  GraphComponent,
  ModelKind,
  SpacerNode,
  TaskEdge,
  withPanZoom,
} from '@patternfly/react-topology';
import { NodeType } from '../../../ApplicationDetails/tabs/overview/visualization/const';
import CommitWorkflowNode from '../../../ApplicationDetails/tabs/overview/visualization/nodes/CommitWorkflowNode';

export const commitComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.edge:
      return TaskEdge;
    case ModelKind.node:
      switch (type) {
        case NodeType.WORKFLOW_NODE:
          return CommitWorkflowNode;
        case NodeType.SPACER_NODE:
          return SpacerNode;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};
