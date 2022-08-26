import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownPosition, DropdownToggle } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { useComponentActions } from '../ApplicationDetailsView/component-actions';

const SidePanelActionMenu: React.FC<{ component: ComponentKind }> = ({ component }) => {
  const navigate = useNavigate();
  const actions = useComponentActions(component, component.metadata.name);
  const [active, setActive] = React.useState<boolean>(false);

  const dropdownItems = React.useMemo(() => {
    if (!actions) {
      return [];
    }
    const handleActionClick = (
      event: MouseEvent | React.MouseEvent<any, MouseEvent> | React.KeyboardEvent<Element>,
      action: Action,
    ): void => {
      event.preventDefault();
      if (isFunction(action.cta)) {
        action.cta();
      } else if (isObject(action.cta)) {
        if (!action.cta.external) {
          navigate(action.cta.href);
        }
      }
    };
    return actions.map((action) => (
      <DropdownItem
        key={action.id}
        icon={action.icon}
        onClick={(e) => handleActionClick(e, action)}
      >
        {action.label}
      </DropdownItem>
    ));
  }, [actions, navigate]);

  const onSelect = () => {
    setActive(false);
  };

  if (!dropdownItems) {
    return null;
  }

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <DropdownToggle
          id="toggle-router-link"
          onToggle={() => setActive((prev) => !prev)}
          toggleIndicator={CaretDownIcon}
        >
          Actions
        </DropdownToggle>
      }
      position={DropdownPosition.right}
      data-test-id="actions-menu-button"
      isOpen={active}
      dropdownItems={dropdownItems}
    />
  );
};

export default SidePanelActionMenu;
