import React from 'react';
import { ActionGroup, Button, ButtonVariant } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import classnames from 'classnames';
import { CloseButton } from '../close-button';
import { ActionGroupWithIconsProps } from './form-component-types';

const ActionGroupWithIcons: React.FC<React.PropsWithChildren<ActionGroupWithIconsProps>> = ({
  onSubmit,
  onClose,
  isDisabled,
  className,
}) => {
  return (
    <ActionGroup className={classnames('pf-v5-c-form pf-v5-c-form__actions--right', className)}>
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          variant={ButtonVariant.plain}
          data-test="check-icon"
          style={{ padding: '0' }}
          isDisabled={isDisabled}
        >
          <CheckIcon />
        </Button>
      )}
      <CloseButton
        additionalClassName="close-button--no-padding"
        dataTestID="close-icon"
        onClick={onClose}
      />
    </ActionGroup>
  );
};

export default ActionGroupWithIcons;
