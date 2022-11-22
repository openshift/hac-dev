import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { css } from '@patternfly/react-styles';
import pipelineStyles from '@patternfly/react-styles/css/components/Topology/topology-pipelines';
import {
  getRunStatusModifier,
  Node,
  NodeModel,
  StatusIcon,
  RunStatus,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { WorkflowNodeModelData, WorkflowNodeType } from '../types';
import { getLinkForElement, statusToRunStatus, TYPE_DESCRIPTIONS } from '../utils/node-utils';

import './WorkflowNodeTipContent.scss';

type WorkflowNodeTipContentProps = {
  element: Node<NodeModel, WorkflowNodeModelData>;
};

const WorkflowNodeTipContent: React.FC<WorkflowNodeTipContentProps> = ({ element }) => {
  const { label, workflowType, children } = element.getData();
  const { pathname } = useLocation();

  const { elementRef, pipelinesRef } = React.useMemo(() => {
    const linkData = getLinkForElement(element);
    const queryParams = `?activeTab=${linkData.tab}${
      linkData.filter ? `&${linkData.filter.name}=${linkData.filter.value}` : ''
    }`;
    return {
      elementRef: `${pathname}${queryParams}`,
      pipelinesRef: `${pathname}?activeTab=pipelineruns`,
    };
  }, [element, pathname]);

  const links = React.useMemo(() => {
    switch (workflowType) {
      case WorkflowNodeType.COMPONENT:
      case WorkflowNodeType.STATIC_ENVIRONMENT:
      case WorkflowNodeType.MANAGED_ENVIRONMENT:
        return [
          <Link key="element-link" data-testid="element-link" to={elementRef}>
            View in tab
          </Link>,
        ];
      case WorkflowNodeType.BUILD:
      case WorkflowNodeType.RELEASE:
        return [
          <Link key="pipeline-runs-link" data-testid="pipeline-runs-link" to={pipelinesRef}>
            View pipeline runs
          </Link>,
        ];
      case WorkflowNodeType.TESTS:
      case WorkflowNodeType.COMPONENT_TEST:
      case WorkflowNodeType.APPLICATION_TEST:
        return [
          <Link key="element-link" data-testid="element-link" to={elementRef}>
            View in tab
          </Link>,
          <Link key="pipeline-runs-link" data-testid="pipeline-runs-link" to={pipelinesRef}>
            View pipeline runs
          </Link>,
        ];
      default:
        return null;
    }
  }, [elementRef, pipelinesRef, workflowType]);

  const runStatusItem = (child: PipelineNodeModel) => {
    const { status } = child.data;
    if (!status) {
      return null;
    }
    const runStatus = statusToRunStatus(status);
    return (
      <>
        <span
          className={css(
            pipelineStyles.topologyPipelinesStatusIcon,
            (runStatus === RunStatus.Running || runStatus === RunStatus.InProgress) &&
              pipelineStyles.modifiers.spin,
            getRunStatusModifier(runStatus),
          )}
        >
          <StatusIcon status={runStatus} />
        </span>{' '}
        {child.data.status}
      </>
    );
  };

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
                <span>{runStatusItem(child)}</span>
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
