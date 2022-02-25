/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import { Menu, MenuContent, MenuGroup, MenuItem, MenuList, Divider } from '@patternfly/react-core';
import { getMenuOptionType } from './action-menu-utils';
import ActionMenuItem from './ActionMenuItem';
import { Action, GroupedMenuOption, MenuOption, MenuOptionType } from './types';

type GroupMenuContentProps = {
  option: GroupedMenuOption;
  onClick: () => void;
};

type ActionMenuContentProps = {
  options: MenuOption[];
  onClick: () => void;
  focusItem?: MenuOption;
};

export const GroupMenuContent: React.FC<GroupMenuContentProps> = ({ option, onClick }) => (
  <>
    <Divider />
    <MenuGroup label={option.label} translate="no">
      <MenuList>
        <ActionMenuContent
          options={option.children}
          onClick={onClick}
          focusItem={option.children[0]}
        />
      </MenuList>
    </MenuGroup>
  </>
);

// Need to keep this in the same file to avoid circular dependency.
export const SubMenuContent: React.FC<GroupMenuContentProps> = ({ option, onClick }) => (
  <MenuItem
    data-testid={option.id}
    flyoutMenu={
      <Menu containsFlyout>
        <MenuContent data-testid="action-items" translate="no">
          <MenuList>
            <ActionMenuContent
              options={option.children}
              onClick={onClick}
              focusItem={option.children[0]}
            />
          </MenuList>
        </MenuContent>
      </Menu>
    }
  >
    {option.label}
  </MenuItem>
);

const ActionMenuContent: React.FC<ActionMenuContentProps> = ({ options, onClick, focusItem }) => {
  return (
    <>
      {options.map((option) => {
        const optionType = getMenuOptionType(option);
        switch (optionType) {
          case MenuOptionType.SUB_MENU:
            return (
              <SubMenuContent
                key={option.id}
                option={option as GroupedMenuOption}
                onClick={onClick}
              />
            );
          case MenuOptionType.GROUP_MENU:
            return (
              <GroupMenuContent
                key={option.id}
                option={option as GroupedMenuOption}
                onClick={onClick}
              />
            );
          default:
            return (
              <ActionMenuItem
                key={option.id}
                action={option as Action}
                onClick={onClick}
                autoFocus={focusItem ? option === focusItem : undefined}
              />
            );
        }
      })}
    </>
  );
};

export default ActionMenuContent;
