import React from 'react';
import {
  SELECTION_STATE,
  useVisualizationController,
  useVisualizationState,
  GraphElement,
} from '@patternfly/react-topology';
import SidePanel from '../../SidePanel/SidePanel';
import CommitWorkflowSidePanel from './sidepanels/CommitWorkflowSidePanel';
import { NodeType } from './visualization/commit-visualization-types';

type Props = {
  scrollIntoView?: (node: GraphElement) => void;
};

const CommitDetailsSidePanel: React.FC<React.PropsWithChildren<Props>> = ({ scrollIntoView }) => {
  const [[selectedId], setSelectedIds] = useVisualizationState<string[]>(SELECTION_STATE, []);
  const controller = useVisualizationController();

  const workflowNode = React.useMemo(() => {
    if (selectedId) {
      const element = controller.getElementById(selectedId);
      if (element.getType() === NodeType.WORKFLOW_NODE) {
        return element;
      }
    }
    return null;
  }, [controller, selectedId]);

  const panel = workflowNode ? (
    <CommitWorkflowSidePanel onClose={() => setSelectedIds([])} workflowNode={workflowNode} />
  ) : null;

  const isExpanded = !!panel;

  const onExpand = React.useCallback(() => {
    if (isExpanded && workflowNode) {
      scrollIntoView?.(workflowNode);
    }
  }, [isExpanded, scrollIntoView, workflowNode]);

  React.useEffect(() => {
    if (isExpanded && workflowNode) {
      scrollIntoView?.(workflowNode);
    }
    // only run when the node changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowNode]);

  return (
    <SidePanel isExpanded={isExpanded} onExpand={onExpand} isInline defaultSize={500}>
      {panel}
    </SidePanel>
  );
};

export default CommitDetailsSidePanel;
