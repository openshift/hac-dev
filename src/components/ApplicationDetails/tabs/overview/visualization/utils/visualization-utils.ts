import { getEdgesFromNodes, getSpacerNodes } from '@patternfly/react-topology';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import update from 'lodash/update';
import { EnvironmentKind } from '../../../../../../types';
import { DEFAULT_NODE_HEIGHT } from '../../../../../topology/const';
import { DAG } from '../../../../../topology/dag';
import { NodeType, NODE_ICON_WIDTH, NODE_PADDING } from '../const';
import {
  PipelineEdgeModel,
  PipelineMixedNodeModel,
  WorkflowNodeModelData,
  WorkflowNodeType,
  Workflow,
  WorkflowResources,
  WorkflowResource,
  WorkflowNodeModel,
} from '../types';

const STATUS_WIDTH = 24;
const BADGE_WIDTH = 36;

const DEFAULT_CHAR_WIDTH = 8;

export const createSpacerNode = (node: PipelineMixedNodeModel): PipelineMixedNodeModel => ({
  id: node.id,
  type: NodeType.SPACER_NODE,
  height: 1,
  width: 1,
  data: {
    ...node,
  },
});

export const getWorkflowNodes = (
  nodes: WorkflowNodeModel<WorkflowNodeModelData>[],
): PipelineMixedNodeModel[] => {
  const spacerNodes: PipelineMixedNodeModel[] = getSpacerNodes(nodes, NodeType.SPACER_NODE).map(
    createSpacerNode,
  );
  return [...nodes, ...spacerNodes];
};

export const getTopologyNodesEdges = (
  workflowNodesList: WorkflowNodeModel<WorkflowNodeModelData>[],
): { nodes: PipelineMixedNodeModel[]; edges: PipelineEdgeModel[] } => {
  const nodes: PipelineMixedNodeModel[] = getWorkflowNodes(workflowNodesList);
  const edges: PipelineEdgeModel[] = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return { nodes, edges };
};

export const dagtoNodes = (dag: DAG): WorkflowNodeModel<WorkflowNodeModelData>[] => {
  if (!(dag instanceof DAG)) {
    return [];
  }
  const nodes: WorkflowNodeModel<WorkflowNodeModelData>[] =
    Array.from(dag.vertices.values()).map((v) => {
      const node: WorkflowNodeModel<WorkflowNodeModelData> = {
        id: v.name,
        type: v.data.workflowType || WorkflowNodeType.PIPELINE,
        label: v.data.label,
        width: v.data.width,
        height: DEFAULT_NODE_HEIGHT,
        status: v.data.status,
        runAfterTasks: v.dependancyNames,
        data: {
          workflowType: v.data.workflowType || WorkflowNodeType.PIPELINE,
          isDisabled: (v.data.resources || []).length === 0,
          isParallelNode: v.data.isParallelNode || false,
          resources: v.data.resources || [],
        },
      };
      return node;
    }) || [];
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
    return text.length * DEFAULT_CHAR_WIDTH;
  }
  context.font = font;
  const { width } = context.measureText(text);

  return width || text.length * DEFAULT_CHAR_WIDTH;
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

export const addPrefixFromResourceName = (prefix: string, resourceName: string) =>
  `${prefix}#${resourceName}`;

export const removePrefixFromResourceName = (name: string) =>
  name.includes('#') ? name.split('#').pop() : name;

export const appendPrefixToResources = (
  resources: WorkflowResources,
  nameToAppend: string,
  additionalPath?: string,
): WorkflowResources =>
  resources.map((e) => {
    let obj = update(cloneDeep(e), 'metadata.name', (name) =>
      addPrefixFromResourceName(nameToAppend, name),
    );
    if (additionalPath && get(obj, additionalPath, false)) {
      obj = update(obj, additionalPath, (name) => addPrefixFromResourceName(nameToAppend, name));
    }
    return obj;
  });

export const workflowToNodes = (workflow: Workflow): WorkflowNodeModel<WorkflowNodeModelData>[] => {
  const workflowDag = new DAG();

  Object.keys(workflow).map((key: string) => {
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
      const validResources = resources.map((r) => removePrefixFromResourceName(r.metadata.name));

      const rootResources = !runAfterResourceKey
        ? resources
        : (resources as any[]).filter((r: WorkflowResource) => {
            const foundResource = get(r, runAfterResourceKey);
            return !validResources.includes(foundResource) || !foundResource;
          });

      const rootResourceNames = rootResources.map((pr) => pr.metadata.name);
      const maxResourceName = removePrefixFromResourceName(getMaxName(rootResources) ?? '');

      const maxWidth = getLabelWidth(maxResourceName);
      resources.forEach((resource: WorkflowResource) => {
        const {
          metadata: { name },
        } = resource;
        const label = removePrefixFromResourceName(name);
        const resourceRunAfter = runAfterResourceKey
          ? get(resource, runAfterResourceKey, runAfter)
          : runAfter;
        const validRunAfters = validResources.includes(
          removePrefixFromResourceName(resourceRunAfter),
        )
          ? [resourceRunAfter]
          : runAfter;

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
          id,
          label,
          isDisabled: false,
          width,
          isParallelNode,
          resources: [resource],
        };

        workflowDag.addEdges(name, workflowData, runBefore, validRunAfters);
      });
    }
  });
  return dagtoNodes(workflowDag);
};

export const getLastEnvironments = (
  environments: EnvironmentKind[],
  callback: (EnvironmentKind) => string = (e: EnvironmentKind) => e.metadata.uid,
): string[] => {
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
  return environments.filter((e) => lastEnvironmentNames.includes(e.metadata.name)).map(callback);
};

export const getLastEnvironmentsNames = (environments: EnvironmentKind[]): string[] =>
  getLastEnvironments(environments, (e: EnvironmentKind) => e?.metadata?.name);

export const updateParallelNodeWidths = (nodes: PipelineMixedNodeModel[]) => {
  if (nodes?.length > 1) {
    const maxWidth = nodes.reduce((max, node) => Math.max(max, node.width), 0);
    nodes.forEach((n) => (n.width = maxWidth));
  }
};
