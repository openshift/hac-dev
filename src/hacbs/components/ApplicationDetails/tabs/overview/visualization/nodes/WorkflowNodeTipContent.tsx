import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getRunStatusModifier, Node, NodeModel, StatusIcon } from '@patternfly/react-topology';
import { WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { getLinkForElement, statusToRunStatus, TYPE_DESCRIPTIONS } from '../utils/node-utils';

import './WorkflowNodeTipContent.scss';

type WorkflowNodeTipContentProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
  setActiveTab: (tabData: { tab: string; filter?: { name: string; value: string } }) => void;
};

const linkButton = (
  key: string,
  label: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
) => (
  <Button key={key} data-testid={key} isInline variant={ButtonVariant.link} onClick={onClick}>
    {label}
  </Button>
);

const WorkflowNodeTipContent: React.FC<WorkflowNodeTipContentProps> = ({
  element,
  setActiveTab,
}) => {
  const { label, workflowType, children } = element.getData();

  const links = React.useMemo(() => {
    switch (workflowType) {
      case WorkflowNodeType.COMPONENT:
      case WorkflowNodeType.STATIC_ENVIRONMENT:
      case WorkflowNodeType.MANAGED_ENVIRONMENT:
        return [
          linkButton('element-link', 'View in tab', () => setActiveTab(getLinkForElement(element))),
        ];
      case WorkflowNodeType.BUILD:
      case WorkflowNodeType.RELEASE:
        return [
          linkButton('pipeline-runs-link', 'View pipeline runs', () =>
            setActiveTab({ tab: 'pipelineruns' }),
          ),
        ];
      case WorkflowNodeType.TESTS:
      case WorkflowNodeType.COMPONENT_TEST:
      case WorkflowNodeType.APPLICATION_TEST:
        return [
          linkButton('element-link', 'View in tab', () => setActiveTab(getLinkForElement(element))),
          linkButton('pipeline-runs-link', 'View pipeline runs', () =>
            setActiveTab({ tab: 'pipelineruns' }),
          ),
        ];
      default:
        return null;
    }
  }, [element, setActiveTab, workflowType]);

  return (
    <div className="hacbs-workload-node__tooltip">
      <div className="hacbs-workload-node__tooltip-title">{label}</div>
      <div className="hacbs-workload-node__tooltip-description">
        {TYPE_DESCRIPTIONS[workflowType]}
      </div>
      {children?.length ? (
        <div className="hacbs-workload-node__tooltip-status-area">
          {children
            .filter((c) => !c.data.hidden && !c.data.isDisabled)
            .map((child) => (
              <React.Fragment key={child.id}>
                <span data-testid="child-row">{child.label}</span>
                <span>
                  {child.data.status ? (
                    <>
                      <span
                        className={css(
                          'hacbs-workload-node__tooltip-status-icon',
                          getRunStatusModifier(statusToRunStatus(child.data.status)),
                        )}
                      >
                        <StatusIcon status={statusToRunStatus(child.data.status)} />
                      </span>{' '}
                      {child.data.status}
                    </>
                  ) : null}
                </span>
              </React.Fragment>
            ))}
        </div>
      ) : null}
      {links ? (
        <div data-id="tip-links" className="hacbs-workload-node__tooltip-links">
          {links}
        </div>
      ) : null}
    </div>
  );
};

export default WorkflowNodeTipContent;
