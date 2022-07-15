import {
  ModelKind,
  GraphComponent,
  DefaultTaskGroup,
  SpacerNode,
  ComponentFactory,
} from '@patternfly/react-topology';
import PipelineRunEdge from './visualization/edges/PipelineRunEdge';
import PipelineRunNode from './visualization/nodes/PipelineRunNode';
import { PipelineRunNodeType } from './visualization/types';

export const pipelineRuncomponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  if (kind === ModelKind.graph) {
    return GraphComponent;
  }
  switch (type) {
    case PipelineRunNodeType.TASK_NODE:
    case PipelineRunNodeType.FINALLY_NODE:
      return PipelineRunNode;
    case PipelineRunNodeType.FINALLY_GROUP:
      return DefaultTaskGroup;
    case PipelineRunNodeType.SPACER_NODE:
      return SpacerNode;
    case PipelineRunNodeType.EDGE:
      return PipelineRunEdge;
    default:
      return undefined;
  }
};
