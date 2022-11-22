import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Popover } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Node, NodeModel, observer, TaskNode, useHover } from '@patternfly/react-topology';
import { WorkflowNodeModelData } from '../types';
import { getWorkflowNodeIcon } from '../utils/node-icon-utils';
import { getLinkForElement, statusToRunStatus } from '../utils/node-utils';
import WorkflowNodeTipContent from './WorkflowNodeTipContent';

import './WorkflowNode.scss';

type WorkflowNodeProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ element }) => {
  const [tipHover, setTipHover] = React.useState<boolean>(false);
  const [tipVisible, setTipVisible] = React.useState<boolean>(false);
  const [hover, hoverRef] = useHover();
  const setSearchParams = useSearchParams()[1];
  const setActiveTab = React.useCallback(
    (tabData: { tab: string; filter?: { name: string; value: string } }, replace = false) => {
      const params = new URLSearchParams();
      params.set('activeTab', tabData.tab);
      if (tabData.filter) {
        params.set(tabData.filter.name, tabData.filter.value);
      }
      setSearchParams(params, { replace });
    },
    [setSearchParams],
  );
  const { isDisabled, workflowType, status, children, hidden } = element.getData();

  const childNodes = children?.filter((n) => !n.data.isDisabled) || [];
  React.useEffect(() => {
    let canceled = false;
    if (tipHover || hover) {
      setTipVisible(true);
    } else {
      setTimeout(() => {
        if (!canceled) {
          setTipVisible(false);
        }
      }, 500);
    }
    return () => {
      canceled = true;
    };
  }, [hover, tipHover]);

  if (hidden) {
    return null;
  }

  return (
    <Popover
      isVisible={tipVisible}
      className="hacbs-workload-node__popover"
      showClose={false}
      bodyContent={
        <div onMouseEnter={() => setTipHover(true)} onMouseLeave={() => setTipHover(false)}>
          <WorkflowNodeTipContent element={element} />
        </div>
      }
      appendTo={() => document.querySelector('#hacDev-modal-container')}
    >
      <g ref={hoverRef}>
        <TaskNode
          truncateLength={element.getLabel().length}
          element={element}
          status={statusToRunStatus(status)}
          showStatusState
          statusIconSize={18}
          hover={isDisabled ? false : undefined}
          badge={childNodes.length ? `${childNodes.length}` : undefined}
          className={css('hacbs-workload-node', { 'm-disabled': isDisabled })}
          taskIcon={getWorkflowNodeIcon(workflowType)}
          paddingY={6}
          onSelect={() => setActiveTab(getLinkForElement(element))}
        />
      </g>
    </Popover>
  );
};

export default observer(WorkflowNode);
