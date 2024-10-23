import React, { useState } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  ChipGroup,
  Chip,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { ContextOption } from './utils';

type ContextSelectListProps = {
  allContexts: ContextOption[];
  filteredContexts: ContextOption[];
  onSelect: (contextName: string) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onRemoveAll: () => void;
  editing: boolean;
};

export const ContextSelectList: React.FC<ContextSelectListProps> = ({
  allContexts,
  filteredContexts,
  onSelect,
  onRemoveAll,
  inputValue,
  onInputValueChange,
  editing,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();

  const NO_RESULTS = 'No results found';

  // Open the dropdown if the input value changes
  React.useEffect(() => {
    if (inputValue) {
      setIsOpen(true);
    }
  }, [inputValue]);

  // Utility function to create a unique item ID based on the context value
  const createItemId = (value: any) => `select-multi-typeahead-${value.replace(' ', '-')}`;

  // Set both the focused and active item for keyboard navigation
  const setActiveAndFocusedItem = (itemIndex: number) => {
    setFocusedItemIndex(itemIndex);
    const focusedItem = filteredContexts[itemIndex];
    setActiveItemId(createItemId(focusedItem.name));
  };

  // Reset focused and active items when the dropdown is closed or input is cleared
  const resetActiveAndFocusedItem = () => {
    setFocusedItemIndex(null);
    setActiveItemId(null);
  };

  // Close the dropdown menu and reset focus states
  const closeMenu = () => {
    setIsOpen(false);
    resetActiveAndFocusedItem();
  };

  // Handle the input field click event to toggle the dropdown
  const onInputClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (!inputValue) {
      closeMenu();
    }
  };

  // Gets the index of the next element we want to focus on, based on the length of
  // the filtered contexts and the arrow key direction.
  const getNextFocusedIndex = (
    currentIndex: number | null,
    length: number,
    direction: 'up' | 'down',
  ) => {
    if (direction === 'up') {
      return currentIndex === null || currentIndex === 0 ? length - 1 : currentIndex - 1;
    }
    return currentIndex === null || currentIndex === length - 1 ? 0 : currentIndex + 1;
  };

  // Handle up/down arrow key navigation for the dropdown
  const handleMenuArrowKeys = (key: string) => {
    // If we're pressing the arrow keys, make sure the list is open.
    if (!isOpen) {
      setIsOpen(true);
    }
    const direction = key === 'ArrowUp' ? 'up' : 'down';
    const indexToFocus = getNextFocusedIndex(focusedItemIndex, filteredContexts.length, direction);
    setActiveAndFocusedItem(indexToFocus);
  };

  // Handle keydown events in the input field (e.g., Enter, Arrow keys)
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const focusedItem = focusedItemIndex !== null ? filteredContexts[focusedItemIndex] : null;

    if (event.key === 'Enter' && focusedItem && focusedItem.name !== NO_RESULTS) {
      onSelect(focusedItem.name);
    }

    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      handleMenuArrowKeys(event.key);
    }
  };

  // Handle selection of a context from the dropdown
  const handleSelect = (value: string) => {
    onSelect(value);
    textInputRef.current?.focus();
  };

  // Toggle the dropdown open/closed
  const onToggleClick = () => {
    setIsOpen(!isOpen);
    textInputRef?.current?.focus();
  };

  // Handle changes to the input field value
  const onTextInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    // Update input value
    onInputValueChange(value);
    resetActiveAndFocusedItem();
  };

  const renderToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      variant="typeahead"
      aria-label="Multi typeahead menu toggle"
      onClick={onToggleClick}
      innerRef={toggleRef}
      isExpanded={isOpen}
      style={{ minWidth: '750px' } as React.CSSProperties}
      data-testid="context-dropdown-toggle"
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onChange={onTextInputChange}
          onClick={onInputClick}
          onKeyDown={onInputKeyDown}
          data-testid="multi-typeahead-select-input"
          id="multi-typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder="Select a context"
          {...(activeItemId && { 'aria-activedescendant': activeItemId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-multi-typeahead-listbox"
        >
          <ChipGroup>
            {allContexts
              .filter((ctx) => ctx.selected)
              .map((ctx) => (
                <Chip
                  key={ctx.name}
                  onClick={() => handleSelect(ctx.name as string)}
                  data-testid={`context-chip-${ctx.name}`}
                >
                  {ctx.name}
                </Chip>
              ))}
          </ChipGroup>
        </TextInputGroupMain>
        {filteredContexts.some((ctx) => ctx.selected) && (
          <TextInputGroupUtilities>
            <Button variant="plain" onClick={onRemoveAll} data-testid={'clear-button'}>
              <TimesIcon aria-hidden />
            </Button>
          </TextInputGroupUtilities>
        )}
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      isOpen={isOpen}
      onSelect={(_event, value) => handleSelect(value as string)}
      onOpenChange={closeMenu}
      style={{ maxWidth: '750px' } as React.CSSProperties}
      toggle={renderToggle}
    >
      <SelectList id="select-multi-typeahead-listbox" data-testid={'context-option-select-list'}>
        {filteredContexts.map((ctx, idx) => (
          <SelectOption
            id={ctx.name}
            key={ctx.name}
            isFocused={focusedItemIndex === idx}
            value={ctx.name}
            isSelected={ctx.selected}
            description={ctx.description}
            ref={null}
            isDisabled={!editing && ctx.name === 'application'}
            data-testid={`context-option-${ctx.name}`}
          >
            {ctx.name}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
