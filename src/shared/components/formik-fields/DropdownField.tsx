import React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';
import BasicDropdown from '../dropdown/BasicDropdown';
import { DropdownFieldProps } from './field-types';
import { getFieldId } from './field-utils';

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  helpText,
  required,
  items,
  name,
  onChange,
  fullWidth,
  ...props
}) => {
  const [field, { touched, error }] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(name, 'dropdown');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={required}
    >
      <BasicDropdown
        {...props}
        items={items}
        selected={field.value}
        fullWidth={fullWidth}
        aria-describedby={helpText ? `${fieldId}-helper` : undefined}
        onChange={(value: string) => {
          onChange && onChange(value);
          setFieldValue(name, value, false);
          setFieldTouched(name, true, false);
        }}
      />
    </FormGroup>
  );
};

export default DropdownField;
