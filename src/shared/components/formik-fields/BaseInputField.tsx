import React from 'react';
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  ValidatedOptions,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { useField } from 'formik';
import { BaseInputFieldProps } from './field-types';
import { getFieldId } from './field-utils';

import './BaseInputField.scss';

const BaseInputField: React.FC<
  BaseInputFieldProps & {
    children: (props) => React.ReactNode;
  }
> = ({
  label,
  labelIcon,
  helpText,
  required,
  children,
  name,
  onChange,
  helpTextInvalid,
  validated,
  dataTest,
  ...props
}) => {
  const [field, { touched, error }] = useField({ name, type: 'input' });
  const fieldId = getFieldId(name, 'input');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      labelIcon={labelIcon}
      isRequired={required}
      data-test={dataTest}
      className="hac-input-field"
    >
      {children({
        ...field,
        ...props,
        value: field.value ?? '',
        id: fieldId,
        label,
        validated: !isValid ? ValidatedOptions.error : validated,
        'aria-describedby': helpText ? `${fieldId}-helper` : undefined,
        onChange: (event) => {
          field.onChange(event);
          onChange && onChange(event);
        },
      })}
      {!isValid || validated === ValidatedOptions.error || helpText ? (
        <FormHelperText>
          <HelperText>
            {!isValid || validated === ValidatedOptions.error ? (
              <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                {errorMessage || helpTextInvalid}
              </HelperTextItem>
            ) : (
              <HelperTextItem>{helpText}</HelperTextItem>
            )}
          </HelperText>
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default BaseInputField;
