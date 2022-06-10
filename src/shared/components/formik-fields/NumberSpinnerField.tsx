import React from 'react';
import { FormGroup } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';
import { toInteger } from 'lodash-es';
import NumberSpinner from '../spinner/NumberSpinner';
import { NumberSpinnerFieldProps } from './field-types';
import { getFieldId } from './field-utils';

const NumberSpinnerField: React.FC<NumberSpinnerFieldProps> = ({
  label,
  helpText,
  required,
  ...props
}) => {
  const [field, { touched, error }] = useField(props.name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(props.name, 'number-spinner');
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
      <NumberSpinner
        {...field}
        {...props}
        value={parseInt(field.value, 10)}
        id={fieldId}
        changeValueBy={(operation: number) => {
          setFieldValue(props.name, toInteger(field.value) + operation);
          setFieldTouched(props.name, true);
        }}
        aria-describedby={helpText ? `${fieldId}-helper` : undefined}
      />
    </FormGroup>
  );
};

export default NumberSpinnerField;
