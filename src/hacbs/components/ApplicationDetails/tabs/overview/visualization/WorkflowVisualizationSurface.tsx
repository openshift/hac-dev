import * as React from 'react';
import {
  GRAPH_LAYOUT_END_EVENT,
  Model,
  Node,
  Visualization,
  VisualizationSurface,
  VisualizationProvider,
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  TopologyControlBar,
  TopologyView,
  Controller,
  Point,
} from '@patternfly/react-topology';
import { DROP_SHADOW_SPACING, NODE_HEIGHT, TOOLBAR_HEIGHT } from './const';
import { componentFactory, layoutFactory } from './factories';

type WorkflowVisualizationSurfaceProps = {
  model: Model;
};

type Size = {
  height: number;
  width: number;
};

const WorkflowVisualizationSurface: React.FC<WorkflowVisualizationSurfaceProps> = ({ model }) => {
  const [vis, setVis] = React.useState<Controller>(null);
  const [maxSize, setMaxSize] = React.useState<Size>(null);

  const onLayoutUpdate = React.useCallback(
    (nodes: Node[]) => {
      const nodeBounds = nodes.map((node) => node.getBounds());
      const maxWidth = Math.floor(
        nodeBounds.map((bounds) => bounds.width).reduce((w1, w2) => Math.max(w1, w2), 0),
      );
      const maxX = Math.floor(
        nodeBounds.map((bounds) => bounds.x).reduce((x1, x2) => Math.max(x1, x2), 0),
      );

      const maxY = Math.floor(
        nodeBounds.map((bounds) => bounds.y).reduce((y1, y2) => Math.max(y1, y2), 0),
      );

      const verticalMargin = 20;
      const horizontalMargin = 20;

      setMaxSize({
        height: maxY + NODE_HEIGHT + DROP_SHADOW_SPACING + TOOLBAR_HEIGHT + verticalMargin * 2,
        width: maxX + maxWidth + DROP_SHADOW_SPACING + horizontalMargin * 2,
      });
    },
    [setMaxSize],
  );

  React.useEffect(() => {
    if (vis === null) {
      const visualization = new Visualization();
      visualization.registerLayoutFactory(layoutFactory);
      visualization.registerComponentFactory(componentFactory);
      visualization.fromModel(model);
      visualization.addEventListener(GRAPH_LAYOUT_END_EVENT, () => {
        onLayoutUpdate(visualization.getGraph().getNodes());
      });
      setVis(visualization);
    } else {
      vis.fromModel(model);
      vis.getGraph().layout();
    }
  }, [vis, model, onLayoutUpdate]);

  if (!vis) return null;

  return (
    <TopologyView
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              vis.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              vis.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              vis.getGraph().fit(90);
            }),
            resetViewCallback: action(() => {
              const g = vis.getGraph();
              g.setScale(1);
              g.setPosition(new Point(15, 0));
              g.layout();
            }),
            legend: false,
          })}
        />
      }
    >
      <div style={{ height: maxSize?.height, width: maxSize?.width }}>
        <VisualizationProvider controller={vis}>
          <VisualizationSurface />
        </VisualizationProvider>
      </div>
    </TopologyView>
  );
};

export default WorkflowVisualizationSurface;
