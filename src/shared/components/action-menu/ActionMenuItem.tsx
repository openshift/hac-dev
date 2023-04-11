import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  KEY_CODES,
  MenuItem,
  Tooltip,
  DropdownItemProps,
  MenuItemProps,
} from '@patternfly/react-core';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import AnalyticsButton from '../../../components/AnalyticsButton/AnalyticsButton';
import { Action } from './types';

export type ActionMenuItemProps = {
  action: Action;
  component?: React.ComponentType<MenuItemProps | DropdownItemProps>;
  autoFocus?: boolean;
  onClick?: () => void;
  onEscape?: () => void;
};

const ActionItem: React.FC<ActionMenuItemProps & { isAllowed: boolean }> = ({
  action,
  onClick,
  onEscape,
  autoFocus,
  isAllowed,
  component,
}) => {
  const { label, icon, disabled, cta } = action;
  const { href, external } = cta as { href: string; external?: boolean };
  const isDisabled = !isAllowed || disabled;
  const navigate = useNavigate();

  const handleClick = React.useCallback(
    (event) => {
      event.preventDefault();
      if (isFunction(cta)) {
        cta();
      } else if (isObject(cta)) {
        if (!cta.external) {
          navigate(cta.href);
        }
      }
      onClick && onClick();
    },
    [cta, navigate, onClick],
  );

  const handleKeyDown = (event) => {
    if (event.keyCode === KEY_CODES.ESCAPE_KEY) {
      onEscape && onEscape();
    }

    if (event.keyCode === KEY_CODES.ENTER) {
      handleClick(event);
    }
  };
  const Component = component ?? MenuItem;

  const props = {
    icon,
    autoFocus,
    onClick: handleClick,
    'data-testid': label,
  };

  const extraProps = {
    onKeyDown: handleKeyDown,
    ...(external ? { to: href, isExternalLink: external } : {}),
  };

  return (
    <Component
      {...props}
      {...(component ? {} : extraProps)}
      component={(compProps) => (
        <AnalyticsButton
          {...compProps}
          variant="plain"
          style={{
            color: isDisabled
              ? 'var(--pf-global--disabled-color--100)'
              : 'var(--pf-c-content--Color)',
          }}
          isAriaDisabled={isDisabled}
          analytics={action.analytics}
        />
      )}
    >
      {label}
    </Component>
  );
};

const ActionMenuItem: React.FC<ActionMenuItemProps> = (props) => {
  const { action } = props;
  const item = <ActionItem {...props} isAllowed />;

  return action.tooltip ? (
    <Tooltip position="left" content={action.tooltip}>
      {item}
    </Tooltip>
  ) : (
    item
  );
};

export default ActionMenuItem;
