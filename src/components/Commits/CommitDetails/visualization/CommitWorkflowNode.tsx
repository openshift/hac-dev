import * as React from 'react';
import {
  observer,
  Node,
  NodeModel,
  TaskNode,
  withSelection,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { runStatusToRunStatus } from '../../../topology/utils';
import { CommitWorkflowNodeModelData } from './commit-visualization-types';
import {
  getCommitWorkflowNodeIcon,
  getCommitWorkflowTooltipText,
} from './commit-visualization-utils';

import './CommitWorkflowNode.scss';

type CommitWorkflowNodeProps = {
  element: Node<NodeModel, CommitWorkflowNodeModelData>;
} & WithSelectionProps;

const CommitWorkflowNode: React.FC<React.PropsWithChildren<CommitWorkflowNodeProps>> = ({
  element,
  ...rest
}) => {
  const { workflowType, status } = element.getData();

  return (
    <TaskNode
      truncateLength={Infinity}
      element={element}
      className="commit-node"
      taskIcon={getCommitWorkflowNodeIcon(workflowType)}
      taskIconTooltip={getCommitWorkflowTooltipText(workflowType)}
      showStatusState
      statusIconSize={14}
      status={runStatusToRunStatus(status)}
      paddingY={6}
      {...rest}
    />
  );
};

export default withSelection()(observer(CommitWorkflowNode));
