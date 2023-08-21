import React from 'react';
import { Spinner } from '@patternfly/react-core';
import { ModelKind, Node } from '@patternfly/react-topology';
import { scrollNodeIntoView } from '../../../PipelineRunDetailsView/visualization/utils/pipelinerun-graph-utils';
import { layoutFactory, PipelineLayout, VisualizationFactory } from '../../../topology/factories';
import GraphErrorState from '../../../topology/factories/GraphErrorState';
import CommitDetailsSidePanel from '../CommitDetailsSidePanel';
import { getTopologyNodesEdges } from './commit-visualization-utils';
import { commitComponentFactory } from './CommitComponentFactory';
import { useCommitWorkflowData } from './useCommitWorkflowData';

import './CommitVisualization.scss';

const CommitVisualization = ({ commit }) => {
  const nodeRef = React.useRef<HTMLDivElement>();
  const [workflowNodes, loaded, errors] = useCommitWorkflowData(commit);
  const { nodes, edges } = getTopologyNodesEdges(workflowNodes);

  const model = React.useMemo(
    () => ({
      graph: {
        x: 50,
        y: 15,
        id: 'commit-overview-graph',
        type: ModelKind.graph,
        layout: PipelineLayout.COMMIT_VISUALIZATION,
      },
      nodes,
      edges,
    }),
    [edges, nodes],
  );

  const scrollIntoView = React.useCallback(
    (node: Node) => {
      if (nodeRef.current) {
        scrollNodeIntoView(node, nodeRef.current);
      }
    },
    [nodeRef],
  );

  if (!model || !loaded) {
    return (
      <div className="pf-v5-u-m-lg">
        <Spinner />
      </div>
    );
  }
  if (loaded && errors?.length > 0) {
    return <GraphErrorState errors={errors} fullHeight />;
  }
  return (
    <div ref={nodeRef} className="commit-graph" data-testid="commit-graph">
      <VisualizationFactory
        componentFactory={commitComponentFactory}
        layoutFactory={layoutFactory}
        model={model}
      >
        <CommitDetailsSidePanel scrollIntoView={scrollIntoView} />
      </VisualizationFactory>
    </div>
  );
};
export default CommitVisualization;
