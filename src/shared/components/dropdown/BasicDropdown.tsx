import React from 'react';
import { Dropdown, DropdownToggle, DropdownItem, DropdownItemProps } from '@patternfly/react-core';
import './BasicDropdown.scss';

export type DropdownItemObject = {
  key: string;
  value: string;
} & DropdownItemProps;

type BasicDropdownProps = {
  items: DropdownItemObject[];
  selected?: string;
  onChange?: (selection: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

const BasicDropdown: React.FC<BasicDropdownProps> = ({
  items,
  selected,
  onChange,
  placeholder,
  disabled,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = React.useState<string>(selected || placeholder);
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen);
  const onSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    setCurrentSelection(event.currentTarget.textContent);
    onChange && onChange(event.currentTarget.textContent);
    setDropdownOpen(false);
  };
  const dropdownItems = React.useMemo(
    () =>
      items.map((item) => {
        const { key, value, ...props } = item;
        return (
          <DropdownItem key={key} {...props}>
            {value}
          </DropdownItem>
        );
      }),
    [items],
  );
  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle onToggle={onToggle} data-test="dropdown-toggle">
          {currentSelection}
        </DropdownToggle>
      }
      isOpen={dropdownOpen}
      dropdownItems={dropdownItems}
      autoFocus={false}
      disabled={disabled}
      className="basic-dropdown"
      data-test="dropdown"
    />
  );
};

export default BasicDropdown;
