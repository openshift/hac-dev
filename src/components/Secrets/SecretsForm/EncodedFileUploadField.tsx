import * as React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import { useField } from 'formik';
import { Base64 } from 'js-base64';
import attempt from 'lodash-es/attempt';
import isError from 'lodash-es/isError';
import { FileUploadField } from '../../../shared';

type EncodedFileUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  helpText?: string;
  required?: boolean;
};

const EncodedFileUploadField: React.FC<React.PropsWithChildren<EncodedFileUploadFieldProps>> = ({
  id,
  name,
  label,
  helpText,
  required,
}) => {
  const [filename, setFilename] = React.useState<string>();
  const [, { value, error, touched }, { setValue, setTouched }] = useField<string>(name);
  const isValid = !(touched && error);

  const onChange = React.useCallback(
    (data: string, fileUploaded?: boolean) => {
      const parsedData = attempt(JSON.parse, data);
      const hasError = isError(parsedData);
      setValue(
        data && !hasError && !!fileUploaded
          ? Base64.encode(JSON.stringify(parsedData))
          : Base64.encode(data),
        true,
      );

      setTimeout(() => setTouched(true));
    },
    [setValue, setTouched],
  );

  const decodedValue = React.useMemo(() => (value ? Base64.decode(value) : ''), [value]);
  return (
    <FileUploadField
      name={name}
      id={id}
      label={label}
      type="text"
      filenamePlaceholder="Drag a file here or upload one"
      browseButtonText="Upload"
      filename={filename}
      value={decodedValue}
      helpText={!isValid ? error : undefined}
      validated={!isValid ? ValidatedOptions.error : ValidatedOptions.default}
      onReadFinished={(_ev, file) => setFilename(file.name)}
      onBlur={() => setTouched(true)}
      onTextChange={(_ev, updated) => onChange(updated)}
      onDataChange={(_ev, updated) => onChange(updated, true)}
      onClearClick={() => {
        setValue('');
        setFilename('');
      }}
      allowEditingUploadedText
      required={required}
    >
      {helpText && <div className="pf-v5-c-form__helper-text">{helpText}</div>}
    </FileUploadField>
  );
};

export default EncodedFileUploadField;
