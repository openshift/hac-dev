import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { getEdgesFromNodes, getSpacerNodes } from '@patternfly/react-topology';
import * as dagre from 'dagre';
import get from 'lodash/get';
import { EnvironmentKind } from '../../../../../../types/coreBuildService';
import { DAG } from '../../../../../topology/dag';
import { NODE_HEIGHT, NodeType, NODE_WIDTH, PipelineLayout, DAGRE_VIEWER_PROPS } from '../const';
import {
  PipelineEdgeModel,
  NodeCreator,
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
export const createWorkflowNode: NodeCreator<WorkflowNodeModelData> = createGenericNode(
  NodeType.WORKFLOW_NODE,
);

export const createSpacerNode = (node: PipelineMixedNodeModel): PipelineMixedNodeModel => ({
  id: node.id,
  type: NodeType.SPACER_NODE,
  height: 10,
  width: 10,
  data: {
    ...node,
  },
});

export const getNodeCreator = (type: NodeType): NodeCreator<WorkflowNodeModelData> => {
  switch (type) {
    case NodeType.WORKFLOW_NODE:
    default:
      return createWorkflowNode;
  }
};

export const getWorkflowNodes = (node: WorkflowNode[]): PipelineMixedNodeModel[] => {
  const nodeList: PipelineMixedNodeModel[] = node?.map((n) => createWorkflowNode(n.id, n.data));
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
        runAfterTasks: v.dependancyNames,
        workflowType: v.data.workflowType || WorkflowNodeType.PIPELINE,
        isDisabled: (v.data.resources || []).length === 0,
        resources: v.data.resources || [],
      },
    })) || [];
  return nodes;
};

export const workflowToNodes = (workflow: Workflow): WorkflowNode[] => {
  const workflowDag = new DAG();

  Object.keys(workflow).map((key) => {
    const { id, data, runBefore, runAfter, isAbstractNode, runAfterResourceKey } = workflow[key];
    const resources = data.resources || [];
    const wData = {
      ...data,
      isDisabled: resources.length === 0,
      resources,
    };

    if (isAbstractNode || wData.isDisabled) {
      wData.label = wData.isDisabled ? `No ${data.label} set` : data.label;
      workflowDag.addEdges(id, wData, runBefore, runAfter);
    } else {
      resources.forEach((resource: K8sResourceCommon) => {
        const {
          metadata: { name },
        } = resource;
        const resourceRunAfter = runAfterResourceKey
          ? get(resource, runAfterResourceKey, runAfter)
          : runAfter;

        const workflowData = {
          ...data,
          id: name,
          label: name,
          isDisabled: false,
          resources: [resource],
        };

        workflowDag.addEdges(name, workflowData, runBefore, resourceRunAfter);
      });
    }
  });
  return dagtoNodes(workflowDag);
};

export const sortEnvironments = (environments: EnvironmentKind[]): string[] => {
  if (!environments) {
    return [];
  }
  const environmentDag = new DAG();

  environments.forEach((env: EnvironmentKind) => {
    const {
      metadata: { name },
      spec: { parentEnvironment },
    } = env;

    const runAfter = parentEnvironment ? parentEnvironment : [];
    environmentDag.addEdges(name, env, [], runAfter);
  });

  const sortedEnvironments: string[] = [];
  environmentDag.topologicalSort((n) => {
    sortedEnvironments.push(n.name);
  });
  return sortedEnvironments;
};

export const getLastEnvironment = (environments: EnvironmentKind[]): string => {
  if (!environments || environments?.length === 0) {
    return 'static-env';
  }
  return sortEnvironments(environments).pop();
};
