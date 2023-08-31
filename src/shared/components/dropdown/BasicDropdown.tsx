import React from 'react';
import { Badge, ValidatedOptions } from '@patternfly/react-core';
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownItemProps,
  DropdownSeparator,
} from '@patternfly/react-core/deprecated';
import './BasicDropdown.scss';

export type DropdownItemObject = {
  key: string;
  value: string;
  separator?: boolean;
} & DropdownItemProps;

type BasicDropdownProps = {
  items: DropdownItemObject[];
  selected?: string;
  recommended?: string;
  onChange?: (selection: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  dropdownToggle?: (
    onToggle: (
      ev:
        | MouseEvent
        | TouchEvent
        | KeyboardEvent
        | React.KeyboardEvent<any>
        | React.MouseEvent<HTMLButtonElement>,
      isOpen: boolean,
    ) => void,
  ) => React.ReactElement;
  validated?: ValidatedOptions;
};

const BasicDropdown: React.FC<BasicDropdownProps> = ({
  items,
  selected,
  recommended,
  onChange,
  placeholder,
  disabled,
  dropdownToggle,
  validated,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const onToggle = (
    ev:
      | MouseEvent
      | TouchEvent
      | KeyboardEvent
      | React.KeyboardEvent<any>
      | React.MouseEvent<HTMLButtonElement>,
    isOpen: boolean,
  ) => setDropdownOpen(isOpen);
  const onSelect = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onChange && onChange(event.currentTarget.textContent);
    setDropdownOpen(false);
  };

  const recommendedBadge = React.useMemo(
    () => (
      <>
        &nbsp;<Badge isRead>Recommended</Badge>
      </>
    ),
    [],
  );

  const dropdownToggleComponent = React.useMemo(
    () =>
      dropdownToggle ? (
        dropdownToggle(onToggle)
      ) : (
        <DropdownToggle onToggle={onToggle} isDisabled={disabled} data-test="dropdown-toggle">
          {selected ? (
            <>
              {selected}
              {selected === recommended && recommendedBadge}
            </>
          ) : (
            placeholder
          )}
        </DropdownToggle>
      ),
    [dropdownToggle, disabled, selected, recommended, recommendedBadge, placeholder],
  );

  const dropdownItems = React.useMemo(
    () =>
      items.map((item) => {
        const { key, value, separator, ...props } = item;
        if (separator) {
          return <DropdownSeparator key={key} />;
        }
        return (
          <DropdownItem key={key} {...props}>
            {value}
            {value === recommended && recommendedBadge}
          </DropdownItem>
        );
      }),
    [items, recommended, recommendedBadge],
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
      {...(validated === ValidatedOptions.error && { 'aria-invalid': true })}
    />
  );
};

export default BasicDropdown;
