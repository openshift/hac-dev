import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { observer, Node, NodeModel, TaskNode } from '@patternfly/react-topology';
import { WorkflowNodeModelData } from '../types';
import { getWorkflowNodeIcon } from '../utils/node-icon-utils';
import { statusToRunStatus } from '../utils/node-utils';
import { getTooltipText } from '../utils/tooltip-utils';

import './WorkflowNode.scss';

type CommitWorkflowNodeProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const CommitWorkflowNode: React.FC<CommitWorkflowNodeProps> = ({ element }) => {
  const { isDisabled, workflowType, status } = element.getData();

  return (
    <TaskNode
      truncateLength={element.getLabel()?.length}
      element={element}
      className={css('commit-node', { 'm-disabled': isDisabled })}
      taskIcon={getWorkflowNodeIcon(workflowType)}
      taskIconTooltip={getTooltipText(workflowType)}
      status={statusToRunStatus(status)}
      showStatusState
      statusIconSize={14}
      hover={isDisabled ? false : undefined}
      paddingY={6}
    />
  );
};

export default observer(CommitWorkflowNode);
