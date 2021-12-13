import React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { useField } from 'formik';
import { CheckboxFieldProps } from './field-types';
import { getFieldId } from './field-utils';

type ToggleableFieldBaseProps = CheckboxFieldProps & {
  children: (props) => React.ReactNode;
};

const ToggleableFieldBase: React.FC<ToggleableFieldBaseProps> = ({
  label,
  formLabel,
  helpText,
  required,
  children,
  value,
  onChange,
  name,
  ...props
}) => {
  const [field, { touched, error }] = useField({ value, name, type: 'checkbox' });
  const fieldId = getFieldId(name, 'checkbox');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  return (
    <FormGroup
      fieldId={fieldId}
      label={formLabel}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={isValid ? 'default' : 'error'}
      isRequired={required}
    >
      {children({
        ...field,
        ...props,
        value: field.value ?? false,
        id: fieldId,
        label,
        isChecked: field.checked,
        isValid,
        'aria-describedby': helpText ? `${fieldId}-helper` : undefined,
        onChange: (val, event) => {
          field.onChange(event);
          onChange && onChange(val);
        },
      })}
    </FormGroup>
  );
};

export default ToggleableFieldBase;
