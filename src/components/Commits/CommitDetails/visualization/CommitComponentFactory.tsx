import {
  ComponentFactory,
  GraphComponent,
  ModelKind,
  SpacerNode,
  TaskEdge,
  withSelection,
} from '@patternfly/react-topology';
import { NodeType } from './commit-visualization-types';
import CommitWorkflowNode from './CommitWorkflowNode';

export const commitComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (kind) {
    case ModelKind.graph:
      return withSelection()(GraphComponent);
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
