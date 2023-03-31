import * as React from 'react';
import { Dropdown, DropdownItem, DropdownSeparator, DropdownToggle } from '@patternfly/react-core';

export type Container = {
  image: string;
  name: string;
};

export type ContainerDropdownProps = {
  initContainers: Container[];
  containers: Container[];
  selectedContainer: Container;
  onChange: () => void;
};

export const ContainerDropdown = ({ initContainers, containers, selectedContainer, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedContainer.name);

  const onToggle = (opened: boolean) => {
    setIsOpen(opened);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-basic');
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const dropdownItems = [];

  if (initContainers && Array.isArray(initContainers)) {
    dropdownItems.push(
      <DropdownItem isDisabled key="init-container-header">
        Init containers
      </DropdownItem>,
    );

    dropdownItems.push(<DropdownSeparator />);

    initContainers.forEach((container) => {
      dropdownItems.push(
        <DropdownItem
          key={`init-container-${container.name}`}
          onClick={() => {
            onChange(container);
            setSelected(container.name);
          }}
        >
          {container.name}
        </DropdownItem>,
      );
    });
  }

  if (containers && Array.isArray(containers)) {
    dropdownItems.push(
      <DropdownItem isDisabled key="container-header">
        Containers
      </DropdownItem>,
    );

    dropdownItems.push(<DropdownSeparator />);

    containers.forEach((container) => {
      dropdownItems.push(
        <DropdownItem
          key={`container-${container.name}`}
          onClick={() => {
            onChange(container);
            setSelected(container.name);
          }}
        >
          {container.name}
        </DropdownItem>,
      );
    });
  }

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle id="toggle-basic" onToggle={onToggle}>
          {selected}
        </DropdownToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};
