import * as React from 'react';
import { Menu, Popper, MenuContent, MenuList } from '@patternfly/react-core';
import ActionMenuContent from './ActionMenuContent';
import ActionMenuToggle from './ActionMenuToggle';
import { ActionMenuVariant, MenuOption } from './types';

import './ActionMenu.scss';

type ActionMenuProps = {
  actions: MenuOption[];
  variant?: ActionMenuVariant;
  label?: string;
  isDisabled?: boolean;
};

type MenuRendererProps = {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  toggleRef: React.RefObject<HTMLButtonElement>;
} & React.ComponentProps<typeof ActionMenuContent>;

const MenuRenderer: React.FC<MenuRendererProps> = ({
  isOpen,
  containerRef,
  menuRef,
  toggleRef,
  ...restProps
}) => {
  const menu = (
    <Menu ref={menuRef} containsFlyout onSelect={restProps.onClick}>
      <MenuContent data-testid="action-menu" translate="no">
        <MenuList>
          <ActionMenuContent {...restProps} />
        </MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <Popper
      reference={toggleRef}
      popper={menu}
      placement="bottom-end"
      isVisible={isOpen}
      appendTo={containerRef.current}
      popperMatchesTriggerWidth={false}
    />
  );
};

const ActionMenu: React.FC<ActionMenuProps> = ({
  variant = ActionMenuVariant.KEBAB,
  label,
  isDisabled,
  actions,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const hideMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="action-menu-container" ref={containerRef}>
      <ActionMenuToggle
        isOpen={isOpen}
        isDisabled={isDisabled}
        toggleRef={toggleRef}
        toggleVariant={variant}
        toggleTitle={label}
        menuRef={menuRef}
        onToggleClick={setIsOpen}
      />
      <MenuRenderer
        isOpen={isOpen}
        options={actions}
        containerRef={containerRef}
        menuRef={menuRef}
        toggleRef={toggleRef}
        onClick={hideMenu}
        focusItem={actions[0]}
      />
    </div>
  );
};

export default ActionMenu;
