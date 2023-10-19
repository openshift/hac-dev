import * as React from 'react';
import { ModelKind } from '@patternfly/react-topology';
import { PipelineLayout } from '../../../../topology/factories';
import { PipelineEdgeModel, PipelineMixedNodeModel } from './types';
import WorkflowVisualizationSurface from './WorkflowVisualizationSurface';

import './WorkflowGraph.scss';

type WorkflowGraphProps = {
  nodes: PipelineMixedNodeModel[];
  edges: PipelineEdgeModel[];
  expanded: boolean;
};

const WorkflowGraph: React.FC<React.PropsWithChildren<WorkflowGraphProps>> = ({
  nodes,
  edges,
  expanded,
}) => {
  return (
    <div className="workflow-graph" data-test="workflow-graph">
      <WorkflowVisualizationSurface
        model={{
          graph: {
            x: expanded ? 30 : 15,
            y: expanded ? 30 : 15,
            id: 'application-overview-graph',
            type: ModelKind.graph,
            layout: expanded
              ? PipelineLayout.EXPANDED_WORKFLOW_VISUALIZATION
              : PipelineLayout.WORKFLOW_VISUALIZATION,
          },
          nodes,
          edges,
        }}
      />
    </div>
  );
};

export default WorkflowGraph;
