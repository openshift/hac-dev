import React from 'react';
import { FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';
import BasicDropdown from '../dropdown/BasicDropdown';
import { DropdownFieldProps } from './field-types';
import { getFieldId } from './field-utils';
import FieldHelperText from './FieldHelperText';

const DropdownField: React.FC<React.PropsWithChildren<DropdownFieldProps>> = ({
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
  className,
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
      isRequired={required}
      className={className}
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
      <FieldHelperText isValid={isValid} errorMessage={errorMessage} helpText={helpText} />
    </FormGroup>
  );
};

export default DropdownField;
