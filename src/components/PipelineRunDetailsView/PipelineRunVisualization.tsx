import React from 'react';
import { GraphElement } from '@patternfly/react-topology';
import { layoutFactory, VisualizationFactory } from '../topology/factories';
import GraphErrorState from '../topology/factories/GraphErrorState';
import { pipelineRuncomponentFactory } from './factories';
import PipelineRunSidePanel from './PipelineRunSidePanel';
import { getPipelineRunDataModel } from './visualization/utils/pipelinerun-graph-utils';

import './PipelineRunVisualization.scss';

const PipelineRunVisualization = ({ pipelineRun, error }) => {
  const nodeRef = React.useRef<HTMLDivElement>();

  const model = React.useMemo(() => {
    return getPipelineRunDataModel(pipelineRun);
  }, [pipelineRun]);

  const scrollIntoView = React.useCallback(
    (element: GraphElement) => {
      nodeRef.current
        ?.querySelector(`[data-id=${element.getId()}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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
