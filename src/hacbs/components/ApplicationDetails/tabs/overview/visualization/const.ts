import * as dagre from 'dagre';

export const NODE_SEPARATION_HORIZONTAL = 15;
export const NODE_SEPARATION_VERTICAL = 20;
export const DROP_SHADOW_SPACING = 5;
export const TOOLBAR_HEIGHT = 40;

export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 30;
export const NODE_PADDING = 12;
export const EDGE_MARKER_WIDTH = 10;

export const NODE_ICON_WIDTH = 30;

export enum NodeType {
  WORKFLOW_NODE = 'workflow-node',
  SPACER_NODE = 'spacer-node',
}

export enum DrawDesign {
  INTEGRAL_SHAPE = 'integral-shape',
  STRAIGHT = 'line',
}

export enum PipelineLayout {
  DAGRE_VIEWER = 'dagre-viewer',
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

export const DAGRE_VIEWER_PROPS: dagre.GraphLabel = {
  ...DAGRE_SHARED_PROPS,
};
