import React from 'react';
import { FileUpload } from '@patternfly/react-core';
import BaseInputField from './BaseInputField';
import { BaseInputFieldProps } from './field-types';

const renderFunction = (
  {
    type,
    children,
    ...baseProps
  }: Omit<BaseInputFieldProps, 'type'> & Omit<React.ComponentProps<typeof FileUpload>, 'validated'>,
  ref: React.Ref<HTMLInputElement>,
) => {
  return (
    <BaseInputField {...baseProps}>
      {(props) => (
        <FileUpload
          ref={ref}
          {...props}
          id={baseProps.id}
          value={baseProps.value ?? props.value}
          type={type}
        >
          {children}
        </FileUpload>
      )}
    </BaseInputField>
  );
};

const FileUploadField = React.forwardRef(renderFunction);

export default FileUploadField;
