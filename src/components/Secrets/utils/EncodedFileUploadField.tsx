import * as React from 'react';
import { useField } from 'formik';
import { Base64 } from 'js-base64';
import { FileUploadField } from '../../../shared';

type EncodedFileUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  helpText?: string;
  required?: boolean;
};

const EncodedFileUploadField: React.FC<EncodedFileUploadFieldProps> = ({
  id,
  name,
  label,
  helpText,
  required,
}) => {
  const [filename, setFilename] = React.useState<string>();
  const [, { value }, { setValue }] = useField<string>(name);

  const onChange = React.useCallback(
    (data: string) => {
      setValue(data ? Base64.encode(data) : '', true);
    },
    [setValue],
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
      onReadFinished={(_ev, file) => setFilename(file.name)}
      onTextChange={(_ev, updated) => onChange(updated)}
      onDataChange={(_ev, updated) => onChange(updated)}
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
