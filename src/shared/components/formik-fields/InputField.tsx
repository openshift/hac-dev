import React from 'react';
import { TextInput, TextInputProps, TextInputTypes } from '@patternfly/react-core';
import BaseInputField from './BaseInputField';
import { BaseInputFieldProps } from './field-types';

const renderFunction = (
  {
    type = TextInputTypes.text,
    ...baseProps
  }: BaseInputFieldProps & Omit<TextInputProps, 'type' | 'validated'>,
  ref: React.Ref<HTMLInputElement>,
) => (
  <BaseInputField type={type} {...baseProps}>
    {(props) => <TextInput ref={ref} {...props} value={baseProps.value ?? props.value} />}
  </BaseInputField>
);

renderFunction.displayName = 'InputField';
const InputField: React.ForwardRefExoticComponent<
  BaseInputFieldProps &
    React.RefAttributes<HTMLInputElement> &
    Omit<TextInputProps, 'type' | 'validated'>
> = React.forwardRef(renderFunction);

export default InputField;
