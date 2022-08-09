import * as React from 'react';
import { ContextMenuItem, ContextSubMenuItem } from '@patternfly/react-topology';
import { getMenuOptionType } from '../../../../shared/components/action-menu/action-menu-utils';
import ActionMenuItem from '../../../../shared/components/action-menu/ActionMenuItem';
import {
  Action,
  GroupedMenuOption,
  MenuOption,
  MenuOptionType,
} from '../../../../shared/components/action-menu/types';

export const createContextMenuItems = (actions: MenuOption[]) => {
  return actions.map((option: MenuOption) => {
    const optionType = getMenuOptionType(option);
    switch (optionType) {
      case MenuOptionType.SUB_MENU:
        return (
          <ContextSubMenuItem label={option.label} key={option.id}>
            {createContextMenuItems((option as GroupedMenuOption).children)}
          </ContextSubMenuItem>
        );
      case MenuOptionType.GROUP_MENU:
        return (
          <React.Fragment key={option.id}>
            {option.label && <h1 className="pf-c-dropdown__group-title">{option.label}</h1>}
            {createContextMenuItems((option as GroupedMenuOption).children)}
          </React.Fragment>
        );
      default:
        return (
          <ActionMenuItem key={option.id} action={option as Action} component={ContextMenuItem} />
        );
    }
  });
};
