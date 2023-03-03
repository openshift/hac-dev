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
  dropdownToggle?: (onToggle: (isOpen: boolean) => void) => React.ReactElement;
};

const BasicDropdown: React.FC<BasicDropdownProps> = ({
  items,
  selected,
  onChange,
  placeholder,
  disabled,
  dropdownToggle,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const onToggle = (isOpen: boolean) => setDropdownOpen(isOpen);
  const onSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onChange && onChange(event.currentTarget.textContent);
    setDropdownOpen(false);
  };

  const dropdownToggleComponent = React.useMemo(
    () =>
      dropdownToggle ? (
        dropdownToggle(onToggle)
      ) : (
        <DropdownToggle onToggle={onToggle} isDisabled={disabled} data-test="dropdown-toggle">
          {selected || placeholder}
        </DropdownToggle>
      ),
    [dropdownToggle, selected, placeholder, disabled],
  );

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
      toggle={dropdownToggleComponent}
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
