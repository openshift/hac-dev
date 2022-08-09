import { Graph, Layout, LayoutFactory, ColaLayout } from '@patternfly/react-topology';

const COLA_LAYOUT = 'Cola';

const DEFAULT_LAYOUT = COLA_LAYOUT;

const layoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  return type === COLA_LAYOUT ? new ColaLayout(graph, { layoutOnDrag: false }) : undefined;
};

export { COLA_LAYOUT, DEFAULT_LAYOUT, layoutFactory };
