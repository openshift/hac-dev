import * as React from 'react';
import {
  DEFAULT_WHEN_OFFSET,
  Node,
  TaskNode,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps,
  withSelection,
  NodeModel,
} from '@patternfly/react-topology';
import { observer } from 'mobx-react';
import { runStatusToRunStatus } from '../../../topology/utils';
import { PipelineRunNodeData } from '../types';
import { getTaskBadgeCount } from '../utils/pipelinerun-graph-utils';
import PipelineRunNodeTooltip from './PipelineRunNodeTooltip';

import './PipelineRunNode.scss';

type PipelineRunNodeProps = {
  element: Node<NodeModel, PipelineRunNodeData>;
} & WithContextMenuProps &
  WithSelectionProps;

const PipelineRunNode: React.FunctionComponent<React.PropsWithChildren<PipelineRunNodeProps>> = ({
  element,
  ...rest
}) => {
  const data = element.getData();
  const status = runStatusToRunStatus(data.status);
  const badgeCount = getTaskBadgeCount(data);

  const whenDecorator = data.whenStatus ? (
    <WhenDecorator element={element} status={data.whenStatus} leftOffset={DEFAULT_WHEN_OFFSET} />
  ) : null;

  return (
    <TaskNode
      className="pipelinerun-node"
      element={element}
      status={status}
      badge={badgeCount ? `${badgeCount}` : undefined}
      badgeClassName="pipelinerun-node__test-status-badge--warning"
      toolTip={<PipelineRunNodeTooltip label={element.getLabel()} steps={data.steps} />}
      toolTipProps={{
        className: 'pipelinerun-node__tooltip',
        position: 'top',
        appendTo: () => document.querySelector('#hacDev-modal-container'),
      }}
      {...rest}
      truncateLength={Infinity}
    >
      {whenDecorator}
    </TaskNode>
  );
};

export default withSelection()(observer(PipelineRunNode));
