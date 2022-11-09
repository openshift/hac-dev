import { getEdgesFromNodes, getSpacerNodes } from '@patternfly/react-topology';
import get from 'lodash/get';
import { EnvironmentKind } from '../../../../../../../types';
import { DEFAULT_NODE_HEIGHT } from '../../../../../topology/const';
import { DAG } from '../../../../../topology/dag';
import { NodeCreatorSetup } from '../../../../../topology/utils/create-utils';
import { NodeType, NODE_WIDTH, NODE_ICON_WIDTH, NODE_PADDING } from '../const';
import {
  PipelineEdgeModel,
  PipelineMixedNodeModel,
  WorkflowNodeModelData,
  WorkflowNode,
  WorkflowNodeType,
  Workflow,
  WorkflowResources,
  WorkflowResource,
} from '../types';

const STATUS_WIDTH = 24;
const BADGE_WIDTH = 36;

const createGenericNode: NodeCreatorSetup = (type, width?, height?) => (name, data) => ({
  id: name,
  label: data.label,
  runAfterTasks: data.runAfterTasks || [],
  data,
  height: height ?? DEFAULT_NODE_HEIGHT,
  width: width ?? NODE_WIDTH,
  type,
});
// Node variations
export const createWorkflowNode: (
  id: string,
  data: WorkflowNodeModelData,
) => PipelineMixedNodeModel = (id: string, data: WorkflowNodeModelData) =>
  createGenericNode(NodeType.WORKFLOW_NODE, data.width)(id, data);

export const createSpacerNode = (node: PipelineMixedNodeModel): PipelineMixedNodeModel => ({
  id: node.id,
  type: NodeType.SPACER_NODE,
  height: 1,
  width: 1,
  data: {
    ...node,
  },
});

export const getWorkflowNodes = (nodes: WorkflowNode[]): PipelineMixedNodeModel[] => {
  const nodeList: PipelineMixedNodeModel[] = nodes?.map((n) => createWorkflowNode(n.id, n.data));
  const spacerNodes: PipelineMixedNodeModel[] = getSpacerNodes(nodeList, NodeType.SPACER_NODE).map(
    createSpacerNode,
  );
  return [...nodeList, ...spacerNodes];
};

export const getTopologyNodesEdges = (
  workflowNodesList: WorkflowNode[],
): { nodes: PipelineMixedNodeModel[]; edges: PipelineEdgeModel[] } => {
  const nodes: PipelineMixedNodeModel[] = getWorkflowNodes(workflowNodesList);
  const edges: PipelineEdgeModel[] = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return { nodes, edges };
};

export const dagtoNodes = (dag: DAG): WorkflowNode[] => {
  if (!(dag instanceof DAG)) {
    return [];
  }
  const nodes: WorkflowNode[] =
    Array.from(dag.vertices.values()).map((v) => ({
      id: v.name,
      data: {
        id: v.name,
        label: v.data.label,
        width: v.data.width,
        status: v.data.status,
        runAfterTasks: v.dependancyNames,
        workflowType: v.data.workflowType || WorkflowNodeType.PIPELINE,
        isDisabled: (v.data.resources || []).length === 0,
        isParallelNode: v.data.isParallelNode || false,
        resources: v.data.resources || [],
      },
    })) || [];
  return nodes;
};

export const getMaxName = (resources: WorkflowResources): string | null => {
  if (!resources || resources.length < 1) {
    return null;
  }
  return resources.sort((a, b) => b.metadata.name.length - a.metadata.name.length)[0].metadata.name;
};

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
    .slice(0, 1)
    .shift();

export const workflowToNodes = (workflow: Workflow): WorkflowNode[] => {
  const workflowDag = new DAG();

  Object.keys(workflow).map((key) => {
    const { id, data, runBefore, runAfter, isAbstractNode, runAfterResourceKey } = workflow[key];
    const resources: WorkflowResources = data.resources || [];
    const isParallelNode = !isAbstractNode && resources.length > 1;
    const isDisabled = resources.length === 0;

    if (isAbstractNode || isDisabled) {
      const label = isDisabled ? `No ${data.label} set` : data.label;

      const wData = {
        ...data,
        isDisabled,
        isParallelNode,
        resources,
        label,
        width: getLabelWidth(label),
      };

      workflowDag.addEdges(id, wData, runBefore, runAfter);
    } else {
      const rootResources = !runAfterResourceKey
        ? resources
        : (resources as []).filter((r) => {
            return !get(r, runAfterResourceKey);
          });

      const rootResourceNames = rootResources.map((pr) => pr.metadata.name);
      const maxResourceName = getMaxName(rootResources) ?? '';

      const maxWidth = getLabelWidth(maxResourceName);
      const validResources = resources.map((r) => r.metadata.name);
      resources.forEach((resource: WorkflowResource) => {
        const {
          metadata: { name, uid },
        } = resource;
        const label = name;
        const resourceRunAfter = runAfterResourceKey
          ? get(resource, runAfterResourceKey, runAfter)
          : runAfter;
        let validRunAfters = runAfter;

        if (Array.isArray(resourceRunAfter)) {
          resourceRunAfter?.forEach((resName) => {
            if (validResources.includes(resName)) {
              validRunAfters.push(resName);
            }
          });
        } else {
          validRunAfters = validResources.includes(resourceRunAfter)
            ? [resourceRunAfter]
            : runAfter;
        }

        const width =
          rootResourceNames.includes(label) || rootResourceNames.length > 1
            ? maxWidth
            : getLabelWidth(label);

        let status = data.status;
        if (typeof data.status === 'function') {
          status = data.status(resource);
        }

        const workflowData = {
          ...data,
          status,
          id: uid,
          label,
          isDisabled: false,
          width,
          isParallelNode,
          resources: [resource],
        };

        workflowDag.addEdges(uid, workflowData, runBefore, validRunAfters);
      });
    }
  });
  return dagtoNodes(workflowDag);
};

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
