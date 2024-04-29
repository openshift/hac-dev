import React from 'react';
import { ElementModel, GraphElement } from '@patternfly/react-topology';
import {
  CommitWorkflowNodeModelData,
  CommitWorkflowNodeType,
} from '../visualization/commit-visualization-types';
import BuildSidePanel from './BuildSidePanel';
import CommitSidePanel from './CommitSidePanel';
import IntegrationTestSidePanel from './IntegrationTestSidePanel';
import ReleaseSidePanel from './ReleaseSidePanel';

import './CommitWorkflowSidePanel.scss';

type Props = {
  onClose: () => void;
  workflowNode: GraphElement<ElementModel, CommitWorkflowNodeModelData>;
};

const CommitWorkflowSidePanel: React.FC<React.PropsWithChildren<Props>> = ({
  workflowNode,
  onClose,
}) => {
  switch (workflowNode.getData().workflowType) {
    case CommitWorkflowNodeType.COMMIT:
      return <CommitSidePanel workflowNode={workflowNode} onClose={onClose} />;
    case CommitWorkflowNodeType.BUILD:
      return <BuildSidePanel workflowNode={workflowNode} onClose={onClose} />;
    case CommitWorkflowNodeType.APPLICATION_TEST:
      return <IntegrationTestSidePanel workflowNode={workflowNode} onClose={onClose} />;
    case CommitWorkflowNodeType.RELEASE:
      return <ReleaseSidePanel workflowNode={workflowNode} onClose={onClose} />;
    default:
      return null;
  }
};

export default CommitWorkflowSidePanel;
