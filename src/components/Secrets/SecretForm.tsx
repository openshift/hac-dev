import React from 'react';
import { Form } from '@patternfly/react-core';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { useFormikContext } from 'formik';
import { SelectInputField } from '../../shared';
import KeyValueFileInputField from '../../shared/components/formik-fields/key-value-file-input-field/KeyValueFileInputField';
import { SecretFormValues, SecretType } from '../../types';
import { RawComponentProps } from '../modal/createModalLauncher';
import {
  getSupportedPartnerTaskKeyValuePairs,
  isPartnerTask,
  getSupportedPartnerTaskSecrets,
} from './secret-utils';
import SecretTypeSelector from './SecretTypeSelector';

type SecretFormProps = RawComponentProps & {
  existingSecrets: string[];
};

const SecretForm: React.FC<SecretFormProps> = ({ existingSecrets }) => {
  const { values, setFieldValue } = useFormikContext<SecretFormValues>();
  const defaultKeyValues = [{ key: '', value: '', readOnlyKey: false }];
  const defaultImageKeyValues = [{ key: '.dockerconfigjson', value: '', readOnlyKey: true }];

  const initialOptions = getSupportedPartnerTaskSecrets().filter(
    (secret) => !existingSecrets.includes(secret.value),
  );
  const [options, setOptions] = React.useState(initialOptions);
  const currentTypeRef = React.useRef(values.type);

  const clearKeyValues = () => {
    const newKeyValues = values.keyValues.filter((kv) => !kv.readOnlyKey);
    setFieldValue('keyValues', [...(newKeyValues.length ? newKeyValues : defaultKeyValues)]);
  };

  const resetKeyValues = () => {
    setOptions([]);
    const newKeyValues = values.keyValues.filter(
      (kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value),
    );
    setFieldValue('keyValues', [...newKeyValues, ...defaultImageKeyValues]);
  };

  return (
    <Form>
      <SecretTypeSelector
        onChange={(type) => {
          currentTypeRef.current = type;
          if (type === SecretType.image) {
            resetKeyValues();
            values.secretName &&
              isPartnerTask(values.secretName) &&
              setFieldValue('secretName', '');
          } else {
            setOptions(initialOptions);
            clearKeyValues();
          }
        }}
      />
      <SelectInputField
        required
        key={values.type}
        name="secretName"
        label="Select or enter name"
        helpText="Unique name of the new secret."
        isCreatable
        isInputValuePersisted
        hasOnCreateOption
        options={options}
        variant={SelectVariant.typeahead}
        toggleId="secret-name-toggle"
        toggleAriaLabel="secret-name-dropdown"
        onClear={() => {
          if (currentTypeRef.current !== values.type || isPartnerTask(values.secretName)) {
            clearKeyValues();
          }
        }}
        onSelect={(e, value) => {
          if (isPartnerTask(value)) {
            setFieldValue('keyValues', [
              ...values.keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value)),
              ...getSupportedPartnerTaskKeyValuePairs(value),
            ]);
          }
          setFieldValue('secretName', value);
        }}
      />
      <KeyValueFileInputField
        name="keyValues"
        data-test="secret-key-value-pair"
        entries={defaultKeyValues}
        disableRemoveAction={values.keyValues.length === 1}
      />
    </Form>
  );
};

export default SecretForm;
