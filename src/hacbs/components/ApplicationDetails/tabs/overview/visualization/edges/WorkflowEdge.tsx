import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Topology/topology-components';
import { Edge } from '@patternfly/react-topology';
import { observer } from 'mobx-react';
import { integralShapePath } from '../utils/draw-utils';

interface WorkflowEdgeProps {
  element: Edge;
  className?: string;
}

const WorkflowEdge: React.FunctionComponent<WorkflowEdgeProps> = ({ element, className }) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const sourceNode = element.getSource();
  const groupClassName = css(styles.topologyEdge, className);

  return (
    <g data-test="workflow-edge" className={groupClassName} fillOpacity={0}>
      <path
        d={integralShapePath(
          startPoint,
          endPoint,
          element.getData()?.indent || sourceNode.getBounds().width,
        )}
        shapeRendering="geometricPrecision"
        transform="translate(0,0.5)"
      />
    </g>
  );
};

export default observer(WorkflowEdge);
