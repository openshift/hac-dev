import React from 'react';
import { TextInput, TextInputTypes } from '@patternfly/react-core';
import BaseInputField from './BaseInputField';
import { BaseInputFieldProps } from './field-types';

const renderFunction = (
  { type = TextInputTypes.text, ...baseProps }: BaseInputFieldProps,
  ref: React.Ref<HTMLInputElement>,
) => (
  <BaseInputField type={type} {...baseProps}>
    {(props) => <TextInput ref={ref} {...props} />}
  </BaseInputField>
);

renderFunction.displayName = 'InputField';
const InputField: React.ForwardRefExoticComponent<
  BaseInputFieldProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef(renderFunction);

export default InputField;
