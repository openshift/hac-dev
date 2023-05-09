import React from 'react';
import { FileUpload } from '@patternfly/react-core';
import BaseInputField from './BaseInputField';
import { BaseInputFieldProps } from './field-types';

const renderFunction = (
  {
    onChange,
    type,
    children,
    ...baseProps
  }: Omit<BaseInputFieldProps, 'onChange' | 'type'> &
    Omit<React.ComponentProps<typeof FileUpload>, 'validated'>,
  ref: React.Ref<HTMLInputElement>,
) => {
  const onChangeHandle = (
    valueData: string | File,
    filenameData: string,
    events:
      | React.DragEvent<HTMLElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    onChange?.(valueData, filenameData, events);
  };
  return (
    <BaseInputField {...baseProps}>
      {(props) => (
        <FileUpload ref={ref} {...props} onChange={onChangeHandle} id={baseProps.id} type={type}>
          {children}
        </FileUpload>
      )}
    </BaseInputField>
  );
};

const FileUploadField = React.forwardRef(renderFunction);

export default FileUploadField;
