import React from 'react';
import {
  SELECTION_STATE,
  useVisualizationController,
  useVisualizationState,
  GraphElement,
} from '@patternfly/react-topology';
import SidePanel from '../SidePanel/SidePanel';
import TaskRunPanel from './sidepanels/TaskRunPanel';
import { isTaskRunNode } from './visualization/utils/pipelinerun-graph-utils';

type Props = {
  scrollIntoView?: (element: GraphElement) => void;
};

const PipelineRunSidePanel: React.FC<Props> = ({ scrollIntoView }) => {
  const [[selectedId], setSelectedIds] = useVisualizationState<string[]>(SELECTION_STATE, []);
  const controller = useVisualizationController();

  const element = React.useMemo(
    () => (selectedId ? controller.getElementById(selectedId) : null),
    [controller, selectedId],
  );

  const panel = isTaskRunNode(element) ? (
    <TaskRunPanel onClose={() => setSelectedIds([])} taskRunNode={element} />
  ) : null;

  const isExpanded = !!panel;

  const onExpand = React.useCallback(() => {
    if (isExpanded && element) {
      scrollIntoView?.(element);
    }
  }, [isExpanded, scrollIntoView, element]);

  React.useEffect(() => {
    if (isExpanded && element) {
      scrollIntoView?.(element);
    }
    // only run when the element changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  return (
    <SidePanel isExpanded={isExpanded} onExpand={onExpand} isInline>
      {panel}
    </SidePanel>
  );
};

export default PipelineRunSidePanel;
