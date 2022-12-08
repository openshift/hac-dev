import React from 'react';
import { CustomError } from '../../../shared/utils/error/custom-error';
import { layoutFactory, VisualizationFactory } from '../topology/factories';
import GraphErrorState from '../topology/factories/GraphErrorState';
import { pipelineRuncomponentFactory } from './factories';
import { getPipelineRunDataModel } from './visualization/utils/pipelinerun-graph-utils';

import './PipelineRunVisualization.scss';

const PipelineRunVisualization = ({ pipelineRun, error }) => {
  const model = React.useMemo(() => {
    return getPipelineRunDataModel(pipelineRun);
  }, [pipelineRun]);

  if (!model || error) {
    const errors = [error || new CustomError('Failed to load graph')];
    return <GraphErrorState errors={errors} />;
  }
  return (
    <div className="pipelinerun-graph" data-test="hacbs-pipelinerun-graph">
      <VisualizationFactory
        componentFactory={pipelineRuncomponentFactory}
        layoutFactory={layoutFactory}
        model={model}
      />
    </div>
  );
};
export default PipelineRunVisualization;
