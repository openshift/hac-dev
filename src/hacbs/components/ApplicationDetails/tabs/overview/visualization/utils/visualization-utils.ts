import { EnvironmentKind } from '../../../../../../types/coreBuildService';
import { DAG } from '../../../../../topology/dag';
import { NodeType, NODE_ICON_WIDTH, NODE_PADDING } from '../const';
import { PipelineMixedNodeModel } from '../types';

const STATUS_WIDTH = 24;
const BADGE_WIDTH = 36;

export const createSpacerNode = (node: PipelineMixedNodeModel): PipelineMixedNodeModel => ({
  id: node.id,
  type: NodeType.SPACER_NODE,
  height: 1,
  width: 1,
  data: {
    ...node,
  },
});

export const getTextWidth = (text: string, font: string = '0.875rem RedHatText'): number => {
  if (!text || text.length === 0) {
    return 0;
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext?.('2d');
  if (!context) {
    return text.length;
  }
  context.font = font;
  const { width } = context.measureText(text);

  return width;
};

export const getLabelWidth = (label: string): number =>
  getTextWidth(label) + NODE_PADDING * 2 + NODE_ICON_WIDTH;

export const getNodeWidth = (label: string, status?: string, children?: string[]): number =>
  getLabelWidth(label) + (status ? STATUS_WIDTH : 0) + (children?.length ? BADGE_WIDTH : 0);

export const getLatestResource = (resources = []) =>
  resources
    ?.sort?.(
      (a, b) =>
        new Date(b.metadata.creationTimestamp).getTime() -
        new Date(a.metadata.creationTimestamp).getTime(),
    )
    .shift();

export const getLastEnvironments = (environments: EnvironmentKind[]): string[] => {
  if (!environments || environments?.length === 0) {
    return ['no-static-environments'];
  }

  const environmentDag = new DAG();
  const validEnvironments = environments.map((e) => e.metadata.name);
  environments.forEach((env: EnvironmentKind) => {
    const {
      metadata: { name },
      spec: { parentEnvironment },
    } = env;
    const foundEnv = validEnvironments.includes(parentEnvironment);
    const runAfter = parentEnvironment && foundEnv ? parentEnvironment : [];

    environmentDag.addEdges(name, env, [], runAfter);
  });

  const lastEnvironmentNames: string[] = [];
  environmentDag.topologicalSort((n) => {
    if (!n.hasOutgoing) {
      lastEnvironmentNames.push(n.name);
    }
  });
  return environments
    .filter((e) => lastEnvironmentNames.includes(e.metadata.name))
    .map((e) => e.metadata.uid);
};

export const updateParallelNodeWidths = (nodes: PipelineMixedNodeModel[]) => {
  if (nodes?.length > 1) {
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
  }
};
