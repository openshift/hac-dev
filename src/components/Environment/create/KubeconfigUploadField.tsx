import * as React from 'react';
import { ValidatedOptions } from '@patternfly/react-core';
import { useField } from 'formik';
import { FileUploadField } from '../../../shared';

type KubeconfigUploadFieldProps = {
  name: string;
};

const KubeconfigUploadField: React.FC<KubeconfigUploadFieldProps> = ({ name }) => {
  const [filename, setFilename] = React.useState<string>();
  const [, { value, touched, error }, { setValue, setTouched }] = useField<string>(name);

  const onChange = React.useCallback(
    (data: string) => {
      setValue(data, true);
      setTouched(true);
    },
    [setTouched, setValue],
  );

  const validated = touched
    ? error
      ? ValidatedOptions.error
      : ValidatedOptions.success
    : ValidatedOptions.default;

  const helpText = touched && !error ? 'Contents verified. Everything looks good.' : '';

  return (
    <FileUploadField
      name={name}
      type="text"
      id="text-file-kubeconfig"
      label="Upload your kubeconfig file or paste its contents"
      filenamePlaceholder="Drag a file here or upload one"
      browseButtonText="Upload"
      validated={validated}
      helpText={helpText}
      filename={filename}
      value={value}
      onReadFinished={(ev, file) => setFilename(file.name)}
      onTextChange={(ev, updated) => onChange(updated)}
      onDataChange={(ev, updated) => onChange(updated)}
      onClearClick={() => {
        setValue('');
        setFilename('');
      }}
      allowEditingUploadedText
      required
    >
      <div className="pf-v5-c-form__helper-text">
        We’ll use the kubeconfig file to connect with your cluster. Credentials are stored in a
        secret until the environment is deleted.
      </div>
    </FileUploadField>
  );
};

export default KubeconfigUploadField;
