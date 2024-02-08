import * as React from 'react';
import {
  Badge,
  Divider,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
} from '@patternfly/react-core';
import { useField } from 'formik';

type SelectComponentsDropdownProps = {
  children: React.ReactNode[];
  toggleText: string;
  onSelect: (item: string | number) => void;
  closeOnSelect?: boolean;
  badgeValue?: number;
};

const SelectComponentsDropdown: React.FC<SelectComponentsDropdownProps> = ({
  children,
  toggleText,
  onSelect,
  closeOnSelect,
  badgeValue,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  return (
    <MenuContainer
      isOpen={isOpen}
      onOpenChange={(o) => setIsOpen(o)}
      toggle={
        <MenuToggle
          ref={toggleRef}
          isExpanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          id="toggle-component-menu"
          aria-label="toggle component menu"
          badge={badgeValue ? <Badge isRead>{badgeValue}</Badge> : null}
          isFullWidth
        >
          {toggleText}
        </MenuToggle>
      }
      menu={
        <Menu
          ref={menuRef}
          id="multi-select-component-menu"
          isScrollable
          onSelect={(_, item) => {
            onSelect(item);
            closeOnSelect && setIsOpen(false);
          }}
        >
          <MenuContent>
            <MenuList>{children}</MenuList>
          </MenuContent>
        </Menu>
      }
      toggleRef={toggleRef}
      menuRef={menuRef}
    />
  );
};

type MultiSelectComponentsDropdownProps = {
  componentNames: string[];
  sourceComponentName?: string;
  name: string;
};

export const MultiSelectComponentsDropdown: React.FC<MultiSelectComponentsDropdownProps> = ({
  sourceComponentName,
  componentNames,
  name,
}) => {
  const [{ value: selectedComponents }, , { setValue }] = useField<string[]>(name);
  const [selectAll, setSelectAll] = React.useState<boolean>(
    componentNames.length - 1 === selectedComponents.length,
  );
  const handleSelect = React.useCallback(
    (item: string) => {
      if (item === 'select-all') {
        if (selectAll) {
          setValue([]);
          setSelectAll(false);
        } else {
          const selected = componentNames.filter((v) => v !== sourceComponentName);
          setValue(selected);
          setSelectAll(true);
        }
      } else {
        if (selectedComponents.includes(item)) {
          const selectedItems = selectedComponents.filter((v) => v !== item);
          setValue(selectedItems);
        } else {
          setValue([...selectedComponents, item]);
        }
      }
    },
    [componentNames, selectAll, setValue, sourceComponentName, selectedComponents],
  );

  return (
    <SelectComponentsDropdown
      toggleText="Choose components to nudge"
      onSelect={handleSelect}
      badgeValue={selectedComponents.length || null}
    >
      <MenuItem hasCheckbox itemId="select-all" isSelected={selectAll}>
        Select all
      </MenuItem>
      <Divider component="li" />
      {componentNames.map((component) => {
        const isSelected = selectedComponents.includes(component);
        const isDisabled = component === sourceComponentName;
        return (
          <MenuItem
            key={component}
            hasCheckbox
            itemId={component}
            isSelected={isSelected}
            isDisabled={isDisabled}
            tooltipProps={
              isDisabled
                ? {
                    trigger: 'mouseenter',
                    content: 'This component is already in the relationship.',
                    zIndex: 1000,
                  }
                : undefined
            }
          >
            {component}
          </MenuItem>
        );
      })}
    </SelectComponentsDropdown>
  );
};

type SingleSelectComponentDropdownProps = {
  componentNames: string[];
  name: string;
  disableMenuItem?: (item: string) => boolean;
};

export const SingleSelectComponentDropdown: React.FC<SingleSelectComponentDropdownProps> = ({
  componentNames,
  name,
  disableMenuItem,
}) => {
  const [{ value }, , { setValue }] = useField<string>(name);
  const handleSelect = React.useCallback(
    (item: string) => {
      setValue(item);
    },
    [setValue],
  );
  return (
    <SelectComponentsDropdown
      toggleText={value || 'Select a component'}
      onSelect={handleSelect}
      closeOnSelect
    >
      {componentNames.map((component) => (
        <MenuItem
          key={component}
          itemId={component}
          selected={value === component}
          isDisabled={disableMenuItem?.(component)}
          tooltipProps={
            disableMenuItem?.(component)
              ? {
                  appendTo: () => document.querySelector('#hacDev-modal-container'),
                  content: 'This component is already in the relationship.',
                }
              : undefined
          }
        >
          {component}
        </MenuItem>
      ))}
    </SelectComponentsDropdown>
  );
};
