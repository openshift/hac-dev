import * as React from 'react';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  Model,
  TopologyControlBar,
} from '@patternfly/react-topology';
import { layoutFactory, VisualizationFactory } from '../../../../topology/factories';
import { componentFactory } from './factories';

type WorkflowVisualizationSurfaceProps = {
  model: Model;
};

const WorkflowVisualizationSurface: React.FC<WorkflowVisualizationSurfaceProps> = ({ model }) => {
  return (
    <VisualizationFactory
      model={model}
      componentFactory={componentFactory}
      layoutFactory={layoutFactory}
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
  );
};

export default WorkflowVisualizationSurface;
