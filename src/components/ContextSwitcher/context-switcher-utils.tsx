import React from 'react';
import { Divider, DrilldownMenu, Flex, FlexItem, MenuItem } from '@patternfly/react-core';
import LockOpenIcon from '@patternfly/react-icons/dist/js/icons/lock-open-icon';
import { ContextMenuItem } from './ContextSwitcher';

export enum ItemVisibility {
  PRIVATE = 'private',
  COMMUNITY = 'community',
}

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

  return (
    <MenuItem itemId={item.key}>
      <Flex>
        <FlexItem>{item.visibility === ItemVisibility.COMMUNITY ? <LockOpenIcon /> : ' '}</FlexItem>
        <FlexItem>{item.name}</FlexItem>
      </Flex>
    </MenuItem>
  );
};

export const getFilteredItems = (items: ContextMenuItem[], filter: string) => {
  const filtered: ContextMenuItem[] = [];
  items.forEach((item) => {
    if (item.name.toLowerCase().includes(filter)) {
      let filteredSubItems: ContextMenuItem[];
      if (item.subItems) {
        filteredSubItems = getFilteredItems(item.subItems, filter);
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
