import React from 'react';
import {
  SELECTION_STATE,
  useVisualizationController,
  useVisualizationState,
  Node,
} from '@patternfly/react-topology';
import SidePanel from '../SidePanel/SidePanel';
import TaskRunPanel from './sidepanels/TaskRunPanel';
import { isTaskRunNode } from './visualization/utils/pipelinerun-graph-utils';

type Props = {
  scrollIntoView?: (node: Node) => void;
};

const PipelineRunSidePanel: React.FC<Props> = ({ scrollIntoView }) => {
  const [[selectedId], setSelectedIds] = useVisualizationState<string[]>(SELECTION_STATE, []);
  const controller = useVisualizationController();

  const taskRunNode = React.useMemo(() => {
    if (selectedId) {
      const element = controller.getElementById(selectedId);
      if (isTaskRunNode(element)) {
        return element;
      }
    }
    return null;
  }, [controller, selectedId]);

  const panel = taskRunNode ? (
    <TaskRunPanel onClose={() => setSelectedIds([])} taskRunNode={taskRunNode} />
  ) : null;

  const isExpanded = !!panel;

  const onExpand = React.useCallback(() => {
    if (isExpanded && taskRunNode) {
      scrollIntoView?.(taskRunNode);
    }
  }, [isExpanded, scrollIntoView, taskRunNode]);

  React.useEffect(() => {
    if (isExpanded && taskRunNode) {
      scrollIntoView?.(taskRunNode);
    }
    // only run when the node changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskRunNode]);

  return (
    <SidePanel isExpanded={isExpanded} onExpand={onExpand} isInline>
      {panel}
    </SidePanel>
  );
};

export default PipelineRunSidePanel;
