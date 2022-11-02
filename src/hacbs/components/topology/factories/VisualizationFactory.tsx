import * as React from 'react';
import {
  GRAPH_LAYOUT_END_EVENT,
  Model,
  Node,
  Visualization,
  VisualizationSurface,
  VisualizationProvider,
  TopologyView,
  Controller,
  LayoutFactory,
  ComponentFactory,
} from '@patternfly/react-topology';
import { DROP_SHADOW_SPACING } from '../const';

type VisualizationFactoryProps = {
  model: Model;
  layoutFactory: LayoutFactory;
  componentFactory: ComponentFactory;
  controlBar?: (controller: Controller) => React.ReactNode;
};

type Size = {
  height: number;
  width: number;
};

const VisualizationFactory: React.FC<VisualizationFactoryProps> = ({
  model,
  layoutFactory,
  componentFactory,
  controlBar,
}) => {
  const [controller, setController] = React.useState<Controller>(null);
  const [maxSize, setMaxSize] = React.useState<Size>(null);
  const layoutRef = React.useRef<string>();

  const onLayoutUpdate = React.useCallback(
    (nodes: Node[]) => {
      const nodeBounds = nodes.map((node) => node.getBounds());

      const maxWidth = Math.floor(
        nodeBounds.map((bounds) => bounds.width).reduce((w1, w2) => Math.max(w1, w2), 0),
      );
      const maxX = Math.floor(
        nodeBounds.map((bounds) => bounds.x).reduce((x1, x2) => Math.max(x1, x2), 0),
      );
      const maxHeight = Math.floor(
        nodeBounds.map((bounds) => bounds.height).reduce((h1, h2) => Math.max(h1, h2), 0),
      );

      const maxObject = nodeBounds.find((nb) => nb.height === maxHeight);

      const maxY = Math.floor(
        nodeBounds.map((bounds) => bounds.y).reduce((y1, y2) => Math.max(y1, y2), 0),
      );

      const verticalMargin = 35;
      const horizontalMargin = 35;

      const finallyTaskHeight = maxObject.y + maxHeight + DROP_SHADOW_SPACING + verticalMargin * 2;
      const regularTaskHeight = maxY + 50 + DROP_SHADOW_SPACING + verticalMargin * 2;

      setMaxSize({
        height: Math.max(finallyTaskHeight, regularTaskHeight) + 15,
        width: maxX + maxWidth + DROP_SHADOW_SPACING + horizontalMargin * 2,
      });
    },
    [setMaxSize],
  );

  React.useEffect(() => {
    if (controller === null) {
      const visualization = new Visualization();
      visualization.registerLayoutFactory(layoutFactory);
      visualization.registerComponentFactory(componentFactory);
      visualization.fromModel(model);
      visualization.addEventListener(GRAPH_LAYOUT_END_EVENT, () => {
        onLayoutUpdate(visualization.getGraph().getNodes());
      });
      setController(visualization);
    } else {
      controller.fromModel(model, model.graph.layout === layoutRef.current);
      layoutRef.current = model.graph.layout;
      controller.getGraph().layout();
    }
  }, [controller, model, onLayoutUpdate, layoutFactory, componentFactory]);

  if (!controller) return null;
  return (
    <div style={{ height: maxSize?.height, width: maxSize?.width }}>
      <VisualizationProvider controller={controller}>
        <TopologyView controlBar={controlBar ? controlBar(controller) : undefined}>
          <VisualizationSurface />
        </TopologyView>
      </VisualizationProvider>
    </div>
  );
};

export default React.memo(VisualizationFactory);
