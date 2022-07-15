import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Topology/topology-components';
import { Edge, Point, SVGArrowMarker } from '@patternfly/react-topology';
import { observer } from 'mobx-react';
import { NodeType, NODE_ICON_WIDTH } from '../const';
import { integralShapePath } from '../utils/draw-utils';

import './WorkflowEdge.scss';

interface WorkflowEdgeProps {
  element: Edge;
  className?: string;
}

const WorkflowEdge: React.FunctionComponent<WorkflowEdgeProps> = ({ element, className }) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const targetNode = element.getTarget();
  const isSpacerNode = targetNode.getData().type === NodeType.SPACER_NODE;
  const groupClassName = css(styles.topologyEdge, className);

  const point = isSpacerNode ? endPoint : new Point(endPoint.x - NODE_ICON_WIDTH + 4, endPoint.y);

  return (
    <g data-test="workflow-edge" className={groupClassName} fillOpacity={0}>
      <path
        d={integralShapePath(startPoint, point)}
        markerEnd={isSpacerNode ? undefined : 'url(#hacbs-workflow-edge-marker)'}
        shapeRendering="geometricPrecision"
        transform="translate(0.5,0.5)"
      />
      <SVGArrowMarker id={'hacbs-workflow-edge-marker'} nodeSize={0} markerSize={10} />
    </g>
  );
};

export default observer(WorkflowEdge);
