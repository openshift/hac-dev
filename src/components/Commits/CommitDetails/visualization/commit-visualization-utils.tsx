import * as React from 'react';
import { GithubIcon } from '@patternfly/react-icons/dist/js/icons/github-icon';
import { ServerIcon } from '@patternfly/react-icons/dist/js/icons/server-icon';
import { EdgeModel, getEdgesFromNodes, getSpacerNodes } from '@patternfly/react-topology';
import PipelineIcon from '../../../../imgs/pipelineIcon.svg';
import {
  CommitWorkflowNodeModel,
  CommitWorkflowNodeType,
  NodeType,
} from './commit-visualization-types';

export const getCommitWorkflowNodeIcon = (type: CommitWorkflowNodeType): React.ReactNode => {
  switch (type) {
    case CommitWorkflowNodeType.COMMIT:
      return <GithubIcon />;
    case CommitWorkflowNodeType.STATIC_ENVIRONMENT:
    case CommitWorkflowNodeType.MANAGED_ENVIRONMENT:
      return <ServerIcon />;
    case CommitWorkflowNodeType.BUILD:
    case CommitWorkflowNodeType.COMPONENT_TEST:
    case CommitWorkflowNodeType.APPLICATION_TEST:
    case CommitWorkflowNodeType.RELEASE:
    default:
      return <img src={PipelineIcon} />;
  }
};

export const getCommitWorkflowTooltipText = (type: CommitWorkflowNodeType): string => {
  switch (type) {
    case CommitWorkflowNodeType.COMMIT:
      return 'Source';
    case CommitWorkflowNodeType.APPLICATION_TEST:
    case CommitWorkflowNodeType.COMPONENT_TEST:
      return 'Integration test';
    case CommitWorkflowNodeType.STATIC_ENVIRONMENT:
    case CommitWorkflowNodeType.MANAGED_ENVIRONMENT:
      return 'Environment';
    case CommitWorkflowNodeType.BUILD:
    case CommitWorkflowNodeType.RELEASE:
    default:
      return 'Pipeline';
  }
};
export const addPrefixToResourceName = (prefix: string, resourceName: string) =>
  `${prefix}--${resourceName}`;

export const getTopologyNodesEdges = (
  workflowNodesList: CommitWorkflowNodeModel[],
): { nodes: CommitWorkflowNodeModel[]; edges: EdgeModel[] } => {
  const spacerNodes = getSpacerNodes(
    workflowNodesList,
    NodeType.SPACER_NODE,
  ) as CommitWorkflowNodeModel[];
  const nodes = [...workflowNodesList, ...spacerNodes];
  const edges: EdgeModel[] = getEdgesFromNodes(nodes, NodeType.SPACER_NODE);

  return { nodes, edges };
};
