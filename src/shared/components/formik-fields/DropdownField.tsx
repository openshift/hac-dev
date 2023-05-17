import React from 'react';
import { FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';
import BasicDropdown from '../dropdown/BasicDropdown';
import { DropdownFieldProps } from './field-types';
import { getFieldId } from './field-utils';

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  labelIcon,
  helpText,
  required,
  items,
  name,
  recommended = null,
  onChange,
  fullWidth,
  validateOnChange = false,
  value,
  isDisabled,
  ...props
}) => {
  const [field, { touched, error }] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(name, 'dropdown');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  const validated = isValid ? ValidatedOptions.default : ValidatedOptions.error;

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      labelIcon={labelIcon}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={validated}
      isRequired={required}
    >
      <BasicDropdown
        {...props}
        validated={validated}
        disabled={isDisabled}
        items={items}
        selected={value ?? field.value}
        recommended={recommended}
        fullWidth={fullWidth}
        aria-describedby={helpText ? `${fieldId}-helper` : undefined}
        onChange={(val: string) => {
          if (onChange) {
            onChange(val);
            return;
          }
          setFieldValue(name, val, validateOnChange);
          setFieldTouched(name, true, false);
        }}
      />
    </FormGroup>
  );
};

export default DropdownField;
