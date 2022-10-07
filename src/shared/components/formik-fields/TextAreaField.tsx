import React from 'react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { useField } from 'formik';
import { TextAreaProps } from './field-types';
import { getFieldId } from './field-utils';

const RenderComponent: React.FC<TextAreaProps & { forwardedRef: React.Ref<HTMLTextAreaElement> }> =
  ({ label, helpText, required, onChange, forwardedRef, ...props }) => {
    const [field, { touched, error }] = useField(props.name);
    const fieldId = getFieldId(props.name, 'input');
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
        <TextArea
          {...field}
          {...props}
          ref={forwardedRef}
          id={fieldId}
          style={{ resize: 'vertical' }}
          validated={isValid ? 'default' : 'error'}
          isRequired={required}
          aria-describedby={helpText ? `${fieldId}-helper` : undefined}
          onChange={(value, event) => {
            onChange && onChange(value);
            field.onChange(event);
          }}
        />
      </FormGroup>
    );
  };

const renderFunction = (props: TextAreaProps, ref: React.Ref<HTMLTextAreaElement>) => (
  <RenderComponent forwardedRef={ref} {...props} />
);

renderFunction.displayName = 'TextAreaField';
const TextAreaField: React.ForwardRefExoticComponent<
  TextAreaProps & React.RefAttributes<HTMLTextAreaElement>
> = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(renderFunction);

export default TextAreaField;
