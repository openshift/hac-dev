import * as React from 'react';
import {
  DEFAULT_WHEN_OFFSET,
  Node,
  RunStatus,
  TaskNode,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps,
  withSelection,
} from '@patternfly/react-topology';
import { observer } from 'mobx-react';
import { runStatusToRunStatus } from '../../../topology/utils';
import PipelineRunNodeTooltip from './PipelineRunNodeTooltip';

import './PipelineRunNode.scss';

type PipelineRunNodeProps = {
  element: Node;
} & WithContextMenuProps &
  WithSelectionProps;

const PipelineRunNode: React.FunctionComponent<PipelineRunNodeProps> = ({ element, ...rest }) => {
  const data = element.getData();
  const nodeStatus = runStatusToRunStatus(data.status);

  const status =
    nodeStatus === RunStatus.Succeeded && (data.testFailCount || data.testWarnCount)
      ? RunStatus.Cancelled
      : nodeStatus;

  const badge =
    data.testFailCount || data.testFailCount
      ? `${data.testFailCount || data.testFailCount}`
      : undefined;
  const badgeClassName = data.testFailCount
    ? 'pipelinerun-node__test-status-badge--failed'
    : 'pipelinerun-node__test-status-badge--warning';

  const whenDecorator = data.whenStatus ? (
    <WhenDecorator element={element} status={data.whenStatus} leftOffset={DEFAULT_WHEN_OFFSET} />
  ) : null;

  return (
    <TaskNode
      className="pipelinerun-node"
      element={element}
      status={status}
      badge={badge}
      badgeClassName={badgeClassName}
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
