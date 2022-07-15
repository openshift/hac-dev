import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Topology/topology-components';
import { Edge } from '@patternfly/react-topology';
import { observer } from 'mobx-react';
import { integralShapePath } from '../../../ApplicationDetails/tabs/overview/visualization/utils/draw-utils';
import { DEFAULT_EDGE_INDENT } from '../../../topology/const';

interface PipelineRunEdgeProps {
  element: Edge;
  className?: string;
}

const PipelineRunEdge: React.FunctionComponent<PipelineRunEdgeProps> = ({ element, className }) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const groupClassName = css(styles.topologyEdge, className);
  const startIndent: number = element.getData()?.indent || 0;

  return (
    <g data-test="pipelinerun-edge" className={groupClassName} fillOpacity={0}>
      <path
        d={integralShapePath(startPoint, endPoint, startIndent, DEFAULT_EDGE_INDENT)}
        transform="translate(0.5,0.5)"
        shapeRendering="geometricPrecision"
      />
    </g>
  );
};

export default observer(PipelineRunEdge);
