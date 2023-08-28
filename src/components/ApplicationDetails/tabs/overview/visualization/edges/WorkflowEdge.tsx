import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { Edge } from '@patternfly/react-topology';
import styles from '@patternfly/react-topology/dist/esm/css/topology-components';
import { observer } from 'mobx-react';
import { NODE_SEPARATION_HORIZONTAL } from '../const';
import { integralShapePath } from '../utils/draw-utils';

interface WorkflowEdgeProps {
  element: Edge;
  className?: string;
}

const WorkflowEdge: React.FunctionComponent<WorkflowEdgeProps> = ({ element, className }) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const sourceNode = element.getSource();
  const targetNode = element.getTarget();
  const groupClassName = css(styles.topologyEdge, className);

  if (sourceNode.getData()?.hidden || targetNode.getData()?.hidden) {
    return null;
  }

  return (
    <g data-test="workflow-edge" className={groupClassName} fillOpacity={0}>
      <path
        d={integralShapePath(
          startPoint,
          endPoint,
          element.getData()?.indent || sourceNode.getBounds().width,
          NODE_SEPARATION_HORIZONTAL / 3,
        )}
        shapeRendering="geometricPrecision"
        transform="translate(0,0.5)"
      />
    </g>
  );
};

export default observer(WorkflowEdge);
