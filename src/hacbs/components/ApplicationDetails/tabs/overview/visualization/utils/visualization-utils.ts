import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { getEdgesFromNodes, getSpacerNodes } from '@patternfly/react-topology';
import * as dagre from 'dagre';
import get from 'lodash/get';
import { EnvironmentKind } from '../../../../../../types/coreBuildService';
import { DAG } from '../../../../../topology/dag';
import {
  NODE_HEIGHT,
  NodeType,
  NODE_WIDTH,
  PipelineLayout,
  DAGRE_VIEWER_PROPS,
  NODE_ICON_WIDTH,
  NODE_PADDING,
} from '../const';
import {
  PipelineEdgeModel,
  NodeCreatorSetup,
  PipelineMixedNodeModel,
  WorkflowNodeModelData,
  WorkflowNode,
  WorkflowNodeType,
  Workflow,
} from '../types';

const createGenericNode: NodeCreatorSetup = (type, width?, height?) => (name, data) => ({
  id: name,
  label: data.label,
  runAfterTasks: data.runAfterTasks || [],
  data,
  height: height ?? NODE_HEIGHT,
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

export const getLayoutData = (layout: PipelineLayout): dagre.GraphLabel => {
  switch (layout) {
    case PipelineLayout.DAGRE_VIEWER:
      return DAGRE_VIEWER_PROPS;
    default:
      return null;
  }
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
        runAfterTasks: v.dependancyNames,
        workflowType: v.data.workflowType || WorkflowNodeType.PIPELINE,
        isDisabled: (v.data.resources || []).length === 0,
        isParallelNode: v.data.isParallelNode || false,
        resources: v.data.resources || [],
      },
    })) || [];
  return nodes;
};

export const getMaxName = (resources: K8sResourceCommon[]): string | null => {
  if (!resources || resources.length < 1) {
    return null;
  }
  return resources.sort((a, b) => b.metadata.name.length - a.metadata.name.length)[0].metadata.name;
};

const getTextWidth = (text: string, font: string = '0.875rem RedHatText'): number => {
  if (!text || text.length === 0) {
    return 0;
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text.length;
  }
  context.font = font;
  const { width } = context.measureText(text);

  return width;
};

export const getlabelWidth = (label: string): number =>
  getTextWidth(label) + NODE_PADDING * 2 + NODE_ICON_WIDTH;

export const workflowToNodes = (workflow: Workflow): WorkflowNode[] => {
  const workflowDag = new DAG();

  Object.keys(workflow).map((key) => {
    const { id, data, runBefore, runAfter, isAbstractNode, runAfterResourceKey } = workflow[key];
    const resources: K8sResourceCommon[] = data.resources || [];
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
        width: getlabelWidth(label),
      };

      workflowDag.addEdges(id, wData, runBefore, runAfter);
    } else {
      const maxWidth = getlabelWidth(getMaxName(resources));
      const validResources = resources.map((r) => r.metadata.name);
      resources.forEach((resource: K8sResourceCommon) => {
        const {
          metadata: { name },
        } = resource;
        const resourceRunAfter = runAfterResourceKey
          ? get(resource, runAfterResourceKey, runAfter)
          : runAfter;
        let validRunAfters = runAfter;
        if (Array.isArray(resourceRunAfter)) {
          resourceRunAfter?.forEach((rName) => {
            if (validResources.includes(rName)) {
              validRunAfters.push(rName);
            }
          });
        } else {
          validRunAfters = validResources.includes(resourceRunAfter)
            ? [resourceRunAfter]
            : runAfter;
        }

        const width = isParallelNode ? maxWidth : getlabelWidth(name);
        const workflowData = {
          ...data,
          id: name,
          label: name,
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

export const getLastEnvironments = (environments: EnvironmentKind[]): string[] => {
  if (!environments || environments?.length === 0) {
    return ['static-env'];
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

  const lastEnvironments: string[] = [];
  environmentDag.topologicalSort((n) => {
    if (!n.hasOutgoing) {
      lastEnvironments.push(n.name);
    }
  });
  return lastEnvironments;
};
