import { Graph, LayoutFactory, PipelineDagreLayout } from '@patternfly/react-topology';
import * as dagre from 'dagre';
import {
  EXPANDED_NODE_SEPARATION_HORIZONTAL,
  NODE_SEPARATION_HORIZONTAL,
  NODE_SEPARATION_VERTICAL,
} from '../../ApplicationDetails/tabs/overview/visualization/const';
import { DEFAULT_NODE_SEPERATION_HORIZONTAL, WHEN_EXPRESSION_SPACING } from '../const';

export enum PipelineLayout {
  WORKFLOW_VISUALIZATION = 'workflow-visualization',
  EXPANDED_WORKFLOW_VISUALIZATION = 'expanded-workflow-visualization',
  PIPELINERUN_VISUALIZATION = 'pipelinerun-visualization',
  PIPELINERUN_VISUALIZATION_SPACED = 'pipelinerun-visualization-with-when-expression',
  COMMIT_VISUALIZATION = 'commit-visualization',
}

const DAGRE_SHARED_PROPS: dagre.GraphLabel = {
  nodesep: NODE_SEPARATION_VERTICAL,
  ranksep: NODE_SEPARATION_HORIZONTAL,
};

const WORKFLOW_VISUALIZATION_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: 10,
};

const EXPANDED_WORKFLOW_VISUALIZATION_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: EXPANDED_NODE_SEPARATION_HORIZONTAL,
};

export const PIPELINERUN_VISUALIZATION_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: DEFAULT_NODE_SEPERATION_HORIZONTAL,
};

export const PIPELINERUN_VISUALIZATION_SPACED_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: DEFAULT_NODE_SEPERATION_HORIZONTAL + WHEN_EXPRESSION_SPACING,
};

export const COMMIT_VISUALIZATION_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
  ranksep: EXPANDED_NODE_SEPARATION_HORIZONTAL,
};

export const getLayoutData = (layout: PipelineLayout): dagre.GraphLabel => {
  switch (layout) {
    case PipelineLayout.WORKFLOW_VISUALIZATION:
      return WORKFLOW_VISUALIZATION_PROPS;
    case PipelineLayout.EXPANDED_WORKFLOW_VISUALIZATION:
      return EXPANDED_WORKFLOW_VISUALIZATION_PROPS;
    case PipelineLayout.COMMIT_VISUALIZATION:
      return COMMIT_VISUALIZATION_PROPS;
    case PipelineLayout.PIPELINERUN_VISUALIZATION:
      return PIPELINERUN_VISUALIZATION_PROPS;
    case PipelineLayout.PIPELINERUN_VISUALIZATION_SPACED:
      return PIPELINERUN_VISUALIZATION_SPACED_PROPS;
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
    ignoreGroups: true,
  });
};
