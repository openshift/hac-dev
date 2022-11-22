import React from 'react';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  ModelKind,
  TopologyControlBar,
} from '@patternfly/react-topology';
import { useCommitWorkflowData } from '../../../ApplicationDetails/tabs/overview/visualization/hooks/useCommitWorkflowData';
import { getTopologyNodesEdges } from '../../../ApplicationDetails/tabs/overview/visualization/utils/visualization-utils';
import { layoutFactory, PipelineLayout, VisualizationFactory } from '../../../topology/factories';
import { commitComponentFactory } from './CommitComponentFactory';

import './CommitVisualization.scss';

const CommitVisualization = ({ commit }) => {
  const [workflowNodes, loaded] = useCommitWorkflowData(commit);
  const { nodes, edges } = getTopologyNodesEdges(workflowNodes);
  const model = {
    graph: {
      x: 50,
      y: 15,
      id: 'commit-overview-graph',
      type: ModelKind.graph,
      layout: PipelineLayout.COMMIT_VISUALIZATION,
    },
    nodes,
    edges,
  };
  if (!model || !loaded) {
    return null;
  }
  return (
    <div className="hacbs-commit-graph" data-testid="hacbs-commit-graph">
      <VisualizationFactory
        componentFactory={commitComponentFactory}
        layoutFactory={layoutFactory}
        model={model}
        fullHeight
        controlBar={(controller) => (
          <TopologyControlBar
            controlButtons={createTopologyControlButtons({
              ...defaultControlButtonsOptions,
              zoomInCallback: action(() => {
                controller.getGraph().scaleBy(4 / 3);
              }),
              zoomOutCallback: action(() => {
                controller.getGraph().scaleBy(0.75);
              }),
              fitToScreenCallback: action(() => {
                controller.getGraph().fit(70);
              }),
              resetViewCallback: action(() => {
                controller.getGraph().reset();
                controller.getGraph().layout();
              }),
              legend: false,
            })}
          />
        )}
      />
    </div>
  );
};
export default CommitVisualization;
