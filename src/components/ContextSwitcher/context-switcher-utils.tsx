import React from 'react';
import { Divider, DrilldownMenu, MenuItem } from '@patternfly/react-core';
import { ContextMenuItem } from './ContextSwitcher';

export const ContextMenuListItem: React.FC<React.PropsWithChildren<{ item: ContextMenuItem }>> = ({
  item,
}) => {
  if (item.subItems) {
    return (
      <MenuItem
        itemId={`group:${item.key}`}
        direction="down"
        drilldownMenu={
          <DrilldownMenu id={`drilldown-${item.key}`}>
            <MenuItem itemId={`group:${item.key}`} direction="up">
              {item.name}
            </MenuItem>
            <Divider component="li" />
            {item.subItems.map((subItem) => (
              <ContextMenuListItem key={subItem.key} item={subItem} />
            ))}
          </DrilldownMenu>
        }
      >
        {item.name}
      </MenuItem>
    );
  }

  return <MenuItem itemId={item.key}>{item.name}</MenuItem>;
};

export const filteredItems = (items: ContextMenuItem[], filter: string) => {
  const filtered: ContextMenuItem[] = [];
  items.forEach((item) => {
    if (item.name.toLowerCase().includes(filter)) {
      let filteredSubItems: ContextMenuItem[];
      if (item.subItems) {
        filteredSubItems = filteredItems(item.subItems, filter);
      }
      filtered.push({ ...item, subItems: filteredSubItems });
    }
  });
  return filtered;
};

export const findItemByKey = (items: ContextMenuItem[], key: string) => {
  let found: ContextMenuItem;
  items.some((item) => {
    if (item.key === key) {
      found = item;
      return true;
    }
    if (item.subItems) {
      const foundSubItem = findItemByKey(item.subItems, key);
      if (foundSubItem) {
        found = foundSubItem;
        return true;
      }
    }
  });
  return found;
};
