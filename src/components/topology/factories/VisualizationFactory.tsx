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
import { DROP_SHADOW_SPACING, MIN_GRAPH_HEIGHT } from '../const';

type VisualizationFactoryProps = {
  model: Model;
  layoutFactory: LayoutFactory;
  componentFactory: ComponentFactory;
  controlBar?: (controller: Controller) => React.ReactNode;
  fullHeight?: boolean;
  children?: React.ReactElement;
};

type Size = {
  height: number;
  width: number;
};

const VisualizationFactory: React.FC<React.PropsWithChildren<VisualizationFactoryProps>> = ({
  model,
  layoutFactory,
  componentFactory,
  controlBar,
  fullHeight = false,
  children,
}) => {
  const [controller, setController] = React.useState<Controller>(null);
  const [maxSize, setMaxSize] = React.useState<Size>(null);
  const layoutRef = React.useRef<string>();

  const onLayoutUpdate = React.useCallback(
    (nodes: Node[]) => {
      const maxX = Math.floor(
        nodes
          .map((node) => {
            const bounds = node.getBounds();
            return bounds.x + bounds.width;
          })
          .reduce((x1, x2) => Math.max(x1, x2), 0),
      );
      const maxY = Math.floor(
        nodes
          .map((node) => {
            const bounds = node.getBounds();
            return bounds.y + bounds.height + (node.isGroup() ? 25 : 0);
          })
          .reduce((y1, y2) => Math.max(y1, y2), 0),
      );

      const verticalMargin = 35;
      const horizontalMargin = 35;

      setMaxSize({
        height: Math.max(MIN_GRAPH_HEIGHT, maxY + verticalMargin * 2),
        width: maxX + DROP_SHADOW_SPACING + horizontalMargin * 2,
      });
    },
    [setMaxSize],
  );

  React.useEffect(() => {
    if (controller === null) {
      const visualization = new Visualization();
      visualization.registerLayoutFactory(layoutFactory);
      visualization.registerComponentFactory(componentFactory);
      visualization.setRenderConstraint(false);
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

  const visualization = (
    <VisualizationProvider controller={controller}>
      <TopologyView controlBar={controlBar ? controlBar(controller) : undefined}>
        <VisualizationSurface />
      </TopologyView>
      {children}
    </VisualizationProvider>
  );

  return fullHeight ? (
    visualization
  ) : (
    <div
      data-testid="visualization-wrapper"
      style={{ height: maxSize?.height, width: maxSize?.width }}
    >
      {visualization}
    </div>
  );
};

export default React.memo(VisualizationFactory);
