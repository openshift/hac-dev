import * as React from 'react';
import {
  DEFAULT_WHEN_OFFSET,
  Node,
  TaskNode,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { observer } from 'mobx-react';

type PipelineRunNodeProps = {
  element: Node;
} & WithContextMenuProps &
  WithSelectionProps;

const PipelineRunNode: React.FunctionComponent<PipelineRunNodeProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  ...rest
}) => {
  const data = element.getData();
  const passedData = React.useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  const hasTaskIcon = !!(data.taskIconClass || data.taskIcon);
  const whenDecorator = data.whenStatus ? (
    <WhenDecorator
      element={element}
      status={data.whenStatus}
      leftOffset={
        hasTaskIcon
          ? DEFAULT_WHEN_OFFSET + (element.getBounds().height - 4) * 0.75
          : DEFAULT_WHEN_OFFSET
      }
    />
  ) : null;

  return (
    <TaskNode
      element={element}
      onContextMenu={data.showContextMenu ? onContextMenu : undefined}
      contextMenuOpen={contextMenuOpen}
      {...passedData}
      {...rest}
      truncateLength={element.getData()?.label?.length}
    >
      {whenDecorator}
    </TaskNode>
  );
};

export default observer(PipelineRunNode);
