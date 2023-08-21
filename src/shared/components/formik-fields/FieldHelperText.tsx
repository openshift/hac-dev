import React from 'react';
import { FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

import './RadioGroupField.scss';

type FieldHelperTextProps = {
  isValid?: boolean;
  errorMessage?: string;
  helpText?: React.ReactNode;
};

const FieldHelperText: React.FC<FieldHelperTextProps> = ({ isValid, errorMessage, helpText }) => {
  if ((isValid || !errorMessage) && !helpText) {
    return null;
  }

  return (
    <FormHelperText>
      <HelperText>
        {!isValid ? (
          <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
            {errorMessage}
          </HelperTextItem>
        ) : (
          <HelperTextItem>{helpText}</HelperTextItem>
        )}
      </HelperText>
    </FormHelperText>
  );
};

export default FieldHelperText;
