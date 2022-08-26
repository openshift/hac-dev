import * as React from 'react';
import { Node } from '@patternfly/react-topology';
import { useComponentActions } from '../../../ApplicationDetailsView/component-actions';
import { createContextMenuItems } from '../actions/contextMenuActions';

const ComponentNodeContextMenu: React.FC<{ element: Node }> = ({ element }) => {
  const { component } = element.getData();
  const actions = useComponentActions(component, component.metadata.name);

  return <>{createContextMenuItems(actions)}</>;
};

export const componentContextMenuActions = (element: Node) => {
  return [<ComponentNodeContextMenu key={element.getId()} element={element} />];
};
