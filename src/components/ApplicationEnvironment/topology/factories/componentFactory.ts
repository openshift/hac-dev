import { ComponentType } from 'react';
import {
  GraphElement,
  ComponentFactory,
  ModelKind,
  GraphComponent,
  withDragNode,
  withContextMenu,
  withSelection,
  withPanZoom,
} from '@patternfly/react-topology';
import { componentContextMenuActions } from '../components/ActionsMenu';
import ComponentNode from '../components/ComponentNode';

const componentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string,
): ComponentType<{ element: GraphElement }> => {
  switch (type) {
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return withSelection({ controlled: true })(
            withDragNode()(withContextMenu(componentContextMenuActions)(ComponentNode)),
          );
        default:
          return undefined;
      }
  }
};

export default componentFactory;
