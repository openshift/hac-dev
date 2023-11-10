import * as React from 'react';
import {
  SELECTION_STATE,
  useVisualizationController,
  useVisualizationState,
  Node,
} from '@patternfly/react-topology';
import SidePanel from '../SidePanel/SidePanel';
import TaskRunPanel from './sidepanels/TaskRunPanel';
import { isTaskNode } from './visualization/utils/pipelinerun-graph-utils';

type Props = {
  scrollIntoView?: (node: Node) => void;
};

const PipelineRunSidePanel: React.FC<React.PropsWithChildren<Props>> = ({ scrollIntoView }) => {
  const [[selectedId], setSelectedIds] = useVisualizationState<string[]>(SELECTION_STATE, []);
  const controller = useVisualizationController();

  const taskNode = React.useMemo(() => {
    if (selectedId) {
      const element = controller.getElementById(selectedId);
      if (isTaskNode(element)) {
        return element;
      }
    }
    return null;
  }, [controller, selectedId]);

  const panel = taskNode ? (
    <TaskRunPanel onClose={() => setSelectedIds([])} taskNode={taskNode} />
  ) : null;

  const isExpanded = !!panel;

  const onExpand = React.useCallback(() => {
    if (isExpanded && taskNode) {
      scrollIntoView?.(taskNode);
    }
  }, [isExpanded, scrollIntoView, taskNode]);

  React.useEffect(() => {
    if (isExpanded && taskNode) {
      scrollIntoView?.(taskNode);
    }
    // only run when the node changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskNode]);

  return (
    <SidePanel isExpanded={isExpanded} onExpand={onExpand} isInline defaultSize={500}>
      {panel}
    </SidePanel>
  );
};

export default PipelineRunSidePanel;
