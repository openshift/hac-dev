import * as React from 'react';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  isNode,
  Model,
  NodeModel,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
} from '@patternfly/react-topology';
import { ComponentKind } from '../../types';
import componentFactory from './topology/factories/componentFactory';
import { DEFAULT_LAYOUT, layoutFactory } from './topology/factories/layoutFactory';

export const DEFAULT_NODE_PAD = 20;
export const NODE_WIDTH = 104;
export const NODE_HEIGHT = 104;
export const NODE_PADDING = [0, DEFAULT_NODE_PAD];

export const TOP_LAYER = 'top';
export const GROUPS_LAYER = 'groups';
export const DEFAULT_LAYER = 'default';
export const BOTTOM_LAYER = 'bottom';

export const DEFAULT_LAYERS = [BOTTOM_LAYER, GROUPS_LAYER, DEFAULT_LAYER, TOP_LAYER];

const graphModel: Model = {
  graph: {
    id: 'topology-graph',
    type: 'graph',
    layout: DEFAULT_LAYOUT,
    layers: DEFAULT_LAYERS,
  },
};

type ApplicationEnvironmentGraphViewProps = {
  components: ComponentKind[];
  selectedId: string | null;
  onSelect: (selected: string | null) => void;
};

const ApplicationEnvironmentGraphView: React.FC<ApplicationEnvironmentGraphViewProps> = ({
  components,
  selectedId,
  onSelect,
}) => {
  const [model, setModel] = React.useState<Model>(graphModel);
  const handleSelection = React.useRef<(selected: string | null) => void>(onSelect);

  React.useEffect(() => {
    handleSelection.current = onSelect;
  }, [onSelect]);

  const createVisualization = () => {
    const newVisualization = new Visualization();
    newVisualization.registerLayoutFactory(layoutFactory);
    newVisualization.registerComponentFactory(componentFactory);

    newVisualization.fromModel(graphModel);
    newVisualization.addEventListener<SelectionEventListener>(SELECTION_EVENT, (ids: string[]) =>
      handleSelection.current(ids[0] || ''),
    );
    return newVisualization;
  };

  const visualizationRef = React.useRef<Visualization>();
  if (!visualizationRef.current) {
    visualizationRef.current = createVisualization();
  }
  const visualization = visualizationRef.current;

  React.useEffect(() => {
    if (components) {
      const nodes: NodeModel[] = components.map((component) => ({
        id: component.metadata.uid,
        type: 'ComponentType',
        label: component.metadata.name,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        group: false,
        visible: true,
        style: {
          padding: NODE_PADDING,
        },
        data: {
          component,
        },
      }));

      setModel((prev) => ({ ...prev, nodes }));
    }
  }, [components]);

  React.useEffect(() => {
    visualization.fromModel(model);
    const selectedItem = selectedId ? visualization.getElementById(selectedId) : null;
    if (model.nodes?.length && (!selectedItem || !selectedItem.isVisible())) {
      onSelect(null);
    }
    // don't update on selection change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, visualization]);

  React.useEffect(() => {
    let resizeTimeout = null;
    if (visualization) {
      const selectedEntity = visualization.getElementById(selectedId);
      if (selectedEntity && isNode(selectedEntity)) {
        resizeTimeout = setTimeout(
          action(() => {
            visualization
              .getGraph()
              .panIntoView(selectedEntity, { offset: 20, minimumVisible: 100 });
            resizeTimeout = null;
          }),
          500,
        );
      }
    }
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [selectedId, visualization]);

  return (
    <VisualizationProvider controller={visualization}>
      <TopologyView
        controlBar={
          <TopologyControlBar
            controlButtons={createTopologyControlButtons({
              ...defaultControlButtonsOptions,
              zoomInCallback: action(() => {
                visualization.getGraph().scaleBy(4 / 3);
              }),
              zoomOutCallback: action(() => {
                visualization.getGraph().scaleBy(0.75);
              }),
              fitToScreenCallback: action(() => {
                visualization.getGraph().fit(80);
              }),
              resetViewCallback: action(() => {
                visualization.getGraph().reset();
                visualization.getGraph().layout();
              }),
              legend: false,
            })}
          />
        }
        data-testid="application-environment-graph"
      >
        <VisualizationSurface state={{ selectedIds: [selectedId] }} />
      </TopologyView>
    </VisualizationProvider>
  );
};

export default ApplicationEnvironmentGraphView;
