import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Tooltip, MenuItemProps } from '@patternfly/react-core';
import { DropdownItemProps } from '@patternfly/react-core/deprecated';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import AnalyticsButton from '../../../components/AnalyticsButton/AnalyticsButton';
import { Action } from './types';

export type ActionMenuItemProps = {
  action: Action;
  component?: React.ComponentType<React.PropsWithChildren<MenuItemProps | DropdownItemProps>>;
  autoFocus?: boolean;
  onClick?: () => void;
  onEscape?: () => void;
};

export const KEY_CODES = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ESCAPE_KEY: 27,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
};

const ActionItem: React.FC<
  React.PropsWithChildren<ActionMenuItemProps & { isAllowed: boolean }>
> = ({ action, onClick, onEscape, autoFocus, isAllowed, component }) => {
  const { label, icon, disabled, cta } = action;
  const { href, external } = cta as { href: string; external?: boolean };
  const isDisabled = !isAllowed || disabled;
  const navigate = useNavigate();

  const handleClick = React.useCallback(
    (event: any) => {
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
              ? 'var(--pf-v5-global--disabled-color--100)'
              : 'var(--pf-v5-c-content--Color)',
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

const ActionMenuItem: React.FC<React.PropsWithChildren<ActionMenuItemProps>> = (props) => {
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
