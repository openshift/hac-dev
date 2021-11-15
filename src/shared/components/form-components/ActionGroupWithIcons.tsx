import React from 'react';
import { ActionGroup, Button, ButtonVariant } from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { CloseButton } from '../close-button';
import { ActionGroupWithIconsProps } from './form-component-types';

const ActionGroupWithIcons: React.FC<ActionGroupWithIconsProps> = ({
  onSubmit,
  onClose,
  isDisabled,
}) => {
  return (
    <ActionGroup className="pf-c-form pf-c-form__actions--right">
      {onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          variant={ButtonVariant.plain}
          data-test-id="check-icon"
          style={{ padding: '0' }}
          isDisabled={isDisabled}
        >
          <CheckIcon />
        </Button>
      )}
      <CloseButton
        additionalClassName="hacDev-close-button--no-padding"
        dataTestID="close-icon"
        onClick={onClose}
      />
    </ActionGroup>
  );
};

export default ActionGroupWithIcons;
