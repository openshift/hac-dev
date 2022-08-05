import * as React from 'react';
import { ModelKind } from '@patternfly/react-topology';
import { PipelineLayout } from './const';
import { PipelineEdgeModel, PipelineMixedNodeModel } from './types';
import WorkflowVisualizationSurface from './WorkflowVisualizationSurface';

import './WorkflowGraph.scss';

type WorkflowGraphProps = {
  nodes: PipelineMixedNodeModel[];
  edges: PipelineEdgeModel[];
};

const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ nodes, edges }) => {
  return (
    <div className="hacbs-workflow-graph" data-test="workflow-graph">
      <WorkflowVisualizationSurface
        model={{
          graph: {
            x: 15,
            y: 0,
            id: 'application-overview-graph',
            type: ModelKind.graph,
            layout: PipelineLayout.DAGRE_VIEWER,
          },
          nodes,
          edges,
        }}
      />
    </div>
  );
};

export default WorkflowGraph;
