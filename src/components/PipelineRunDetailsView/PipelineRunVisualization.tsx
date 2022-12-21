import React from 'react';
import { layoutFactory, VisualizationFactory } from '../topology/factories';
import GraphErrorState from '../topology/factories/GraphErrorState';
import { pipelineRuncomponentFactory } from './factories';
import { getPipelineRunDataModel } from './visualization/utils/pipelinerun-graph-utils';

import './PipelineRunVisualization.scss';

const PipelineRunVisualization = ({ pipelineRun, error }) => {
  const model = React.useMemo(() => {
    return getPipelineRunDataModel(pipelineRun);
  }, [pipelineRun]);

  if (error) {
    return <GraphErrorState errors={[error]} />;
  }
  if (!model && !error) {
    return null;
  }
  return (
    <div className="pipelinerun-graph" data-test="pipelinerun-graph">
      <VisualizationFactory
        componentFactory={pipelineRuncomponentFactory}
        layoutFactory={layoutFactory}
        model={model}
      />
    </div>
  );
};
export default PipelineRunVisualization;
