import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { observer, Node, NodeModel, TaskNode } from '@patternfly/react-topology';
import { WorkflowNodeModelData } from '../types';
import { getWorkflowNodeIcon } from '../utils/node-icon-utils';

import './WorkflowNode.scss';

type WorkflowNodeProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ element }) => {
  const { isDisabled, workflowType } = element.getData();

  return (
    <TaskNode
      truncateLength={element.getData().label?.length}
      element={element}
      className={css({ 'hacbs-workload-node__disabled': isDisabled })}
      taskIcon={getWorkflowNodeIcon(workflowType)}
      taskIconTooltip={workflowType}
      paddingY={6}
    />
  );
};

export default observer(WorkflowNode);
