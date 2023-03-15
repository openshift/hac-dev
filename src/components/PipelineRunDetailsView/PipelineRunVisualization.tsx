import React from 'react';
import { Node } from '@patternfly/react-topology';
import { layoutFactory, VisualizationFactory } from '../topology/factories';
import GraphErrorState from '../topology/factories/GraphErrorState';
import { pipelineRuncomponentFactory } from './factories';
import PipelineRunSidePanel from './PipelineRunSidePanel';
import {
  getPipelineRunDataModel,
  scrollNodeIntoView,
} from './visualization/utils/pipelinerun-graph-utils';

import './PipelineRunVisualization.scss';

const PipelineRunVisualization = ({ pipelineRun, error, taskRuns }) => {
  const nodeRef = React.useRef<HTMLDivElement>();

  const model = React.useMemo(() => {
    return getPipelineRunDataModel(pipelineRun, taskRuns);
  }, [pipelineRun, taskRuns]);

  const scrollIntoView = React.useCallback(
    (node: Node) => {
      if (nodeRef.current) {
        scrollNodeIntoView(node, nodeRef.current);
      }
    },
    [nodeRef],
  );

  if (error) {
    return <GraphErrorState errors={[error]} />;
  }
  if (!model && !error) {
    return null;
  }
  return (
    <div ref={nodeRef} className="pipelinerun-graph" data-test="pipelinerun-graph">
      <VisualizationFactory
        componentFactory={pipelineRuncomponentFactory}
        layoutFactory={layoutFactory}
        model={model}
      >
        <PipelineRunSidePanel scrollIntoView={scrollIntoView} />
      </VisualizationFactory>
    </div>
  );
};
export default PipelineRunVisualization;
