import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownItemProps,
  Badge,
} from '@patternfly/react-core';
import './BasicDropdown.scss';

export type DropdownItemObject = {
  key: string;
  value: string;
} & DropdownItemProps;

type BasicDropdownProps = {
  items: DropdownItemObject[];
  selected?: string;
  recommended?: string;
  onChange?: (selection: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  dropdownToggle?: (onToggle: (isOpen: boolean) => void) => React.ReactElement;
};

const BasicDropdown: React.FC<BasicDropdownProps> = ({
  items,
  selected,
  recommended,
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
          {(
            <>
              {selected}&nbsp;{selected === recommended && <Badge isRead>Recommended</Badge>}
            </>
          ) || placeholder}
        </DropdownToggle>
      ),
    [dropdownToggle, disabled, selected, recommended, placeholder],
  );

  const dropdownItems = React.useMemo(
    () =>
      items.map((item) => {
        const { key, value, ...props } = item;
        return (
          <DropdownItem key={key} {...props}>
            {value}&nbsp;{value === recommended && <Badge isRead>Recommended</Badge>}
          </DropdownItem>
        );
      }),
    [items, recommended],
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
