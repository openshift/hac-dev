import * as React from 'react';
import { MenuToggle } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/js/icons';
import { ActionMenuVariant } from './types';

type ActionMenuToggleProps = {
  isOpen: boolean;
  isDisabled: boolean;
  menuRef: React.RefObject<HTMLElement>;
  toggleRef: React.RefObject<HTMLButtonElement>;
  toggleVariant?: ActionMenuVariant;
  toggleTitle?: string;
  onToggleClick: (state: React.SetStateAction<boolean>) => void;
  onToggleHover?: () => void;
};

const ActionMenuToggle: React.FC<ActionMenuToggleProps> = ({
  isOpen,
  isDisabled,
  menuRef,
  toggleRef,
  toggleVariant = ActionMenuVariant.KEBAB,
  toggleTitle,
  onToggleClick,
  onToggleHover,
}) => {
  const isKebabVariant = toggleVariant === ActionMenuVariant.KEBAB;
  const toggleLabel = toggleTitle || 'Actions';

  const handleMenuKeys = (event) => {
    if (!isOpen) {
      return;
    }
    if (menuRef.current) {
      if (event.key === 'Escape') {
        onToggleClick(false);
        toggleRef.current.focus();
      }
      if (!menuRef.current?.contains(event.target) && event.key === 'Tab') {
        onToggleClick(false);
      }
    }
  };

  const handleClickOutside = (event) => {
    if (
      isOpen &&
      !menuRef.current?.contains(event.target) &&
      !toggleRef.current?.contains(event.target) &&
      toggleRef.current !== event.target
    ) {
      onToggleClick(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // This needs to be run only on component mount/unmount

  const handleToggleClick = () => {
    // let the click event propagate before opening (to avoid immediate close on window click)
    requestAnimationFrame(() => {
      onToggleClick((open) => !open);

      // let the menu show before setting focus
      requestAnimationFrame(() => {
        const firstElement = menuRef?.current?.querySelector<HTMLElement>(
          'li > button:not(:disabled)',
        );
        firstElement?.focus();
      });
    });
  };

  return (
    <MenuToggle
      variant={toggleVariant}
      innerRef={toggleRef}
      isExpanded={isOpen}
      isDisabled={isDisabled}
      aria-expanded={isOpen}
      aria-label={toggleLabel}
      aria-haspopup="true"
      data-testid={isKebabVariant ? 'kebab-button' : toggleLabel}
      onClick={handleToggleClick}
      onFocus={onToggleHover}
      onMouseOver={onToggleHover}
    >
      {isKebabVariant ? <EllipsisVIcon /> : toggleLabel}
    </MenuToggle>
  );
};

export default ActionMenuToggle;
