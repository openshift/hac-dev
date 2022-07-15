import { Graph, LayoutFactory, PipelineDagreLayout } from '@patternfly/react-topology';
import * as dagre from 'dagre';
import {
  NODE_SEPARATION_HORIZONTAL,
  NODE_SEPARATION_VERTICAL,
} from '../../ApplicationDetails/tabs/overview/visualization/const';
import { DEFAULT_NODE_SEPERATION_HORIZONTAL } from '../const';

export enum PipelineLayout {
  WORKFLOW_VISUALIZATION = 'workflow-visualization',
  PIPELINERUN_VISUALIZATION = 'pipelinerun-visualization',
}

const DAGRE_SHARED_PROPS: dagre.GraphLabel = {
  nodesep: NODE_SEPARATION_VERTICAL,
  ranksep: NODE_SEPARATION_HORIZONTAL,
  edgesep: 60,
  ranker: 'longest-path',
  rankdir: 'LR',
  marginx: 20,
  marginy: 20,
};

export const PIPELINERUN_VISUALIZATION_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: DEFAULT_NODE_SEPERATION_HORIZONTAL,
};

export const getLayoutData = (layout: PipelineLayout): dagre.GraphLabel => {
  switch (layout) {
    case PipelineLayout.WORKFLOW_VISUALIZATION:
      return DAGRE_SHARED_PROPS;
    case PipelineLayout.PIPELINERUN_VISUALIZATION:
      return PIPELINERUN_VISUALIZATION_PROPS;
    default:
      return null;
  }
};

export const layoutFactory: LayoutFactory = (layout: PipelineLayout, graph: Graph) => {
  const layoutData = getLayoutData(layout);
  if (!layoutData) {
    return null;
  }
  return new PipelineDagreLayout(graph, {
    ...layoutData,
  });
};
