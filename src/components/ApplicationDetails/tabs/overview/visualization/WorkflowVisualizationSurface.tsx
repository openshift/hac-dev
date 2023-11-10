import * as React from 'react';
import { Model } from '@patternfly/react-topology';
import { layoutFactory, VisualizationFactory } from '../../../../topology/factories';
import { componentFactory } from './factories';

type WorkflowVisualizationSurfaceProps = {
  model: Model;
};

const WorkflowVisualizationSurface: React.FC<
  React.PropsWithChildren<WorkflowVisualizationSurfaceProps>
> = ({ model }) => {
  return (
    <VisualizationFactory
      model={model}
      componentFactory={componentFactory}
      layoutFactory={layoutFactory}
    />
  );
};

export default WorkflowVisualizationSurface;
