import React from 'react';
import { Form } from '@patternfly/react-core';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { useFormikContext } from 'formik';
import { DropdownItemObject, SelectInputField } from '../../shared';
import KeyValueFileInputField from '../../shared/components/formik-fields/key-value-file-input-field/KeyValueFileInputField';
import { SecretFormValues, SecretTypeDropdownLabel, KeyValueEntry } from '../../types';
import { RawComponentProps } from '../modal/createModalLauncher';
import SecretTypeSelector from './SecretTypeSelector';
import {
  getSupportedPartnerTaskKeyValuePairs,
  isPartnerTask,
  getSupportedPartnerTaskSecrets,
} from './utils/secret-utils';

type SecretFormProps = RawComponentProps & {
  existingSecrets: string[];
  keyValues: KeyValueEntry;
};

const SecretForm: React.FC<React.PropsWithChildren<SecretFormProps>> = ({
  existingSecrets,
  keyValues,
}) => {
  const { values, setFieldValue } = useFormikContext<SecretFormValues>();
  const defaultKeyValues = [{ key: '', value: '', readOnlyKey: false }];
  const defaultImageKeyValues = [{ key: '.dockerconfigjson', value: '', readOnlyKey: true }];

  const partnerTaskSecrets = getSupportedPartnerTaskSecrets().map((secret) => secret.value);
  const initialOptions = existingSecrets
    .filter((secret) => !partnerTaskSecrets.includes(secret))
    .map((secret) => ({ value: secret }));
  const [options, setOptions] = React.useState(initialOptions);
  const currentTypeRef = React.useRef(values.type);

  const clearKeyValues = () => {
    setFieldValue('keyValues', defaultKeyValues);
  };

  const resetKeyValues = () => {
    setOptions([]);
    const newKeyValues = values.keyValues.filter(
      (kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value),
    );
    setFieldValue('keyValues', [...newKeyValues, ...defaultImageKeyValues]);
  };

  const dropdownItems: DropdownItemObject[] = Object.entries(SecretTypeDropdownLabel).reduce(
    (acc, [key, value]) => {
      value !== SecretTypeDropdownLabel.source && acc.push({ key, value });
      return acc;
    },
    [],
  );

  return (
    <Form>
      <SecretTypeSelector
        dropdownItems={dropdownItems}
        onChange={(type) => {
          currentTypeRef.current = type;
          if (type === SecretTypeDropdownLabel.image) {
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
        label="Select or enter secret name"
        helpText="Unique name of the new secret."
        isCreatable
        isInputValuePersisted
        hasOnCreateOption
        options={options}
        variant={SelectVariant.typeahead}
        toggleId="secret-name-toggle"
        toggleAriaLabel="secret-name-dropdown"
        onClear={() => {
          clearKeyValues();
        }}
        onSelect={(e, value) => {
          if (isPartnerTask(value)) {
            setFieldValue('keyValues', [
              ...values.keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value)),
              ...getSupportedPartnerTaskKeyValuePairs(value),
            ]);
          } else {
            const secretValueIndex = values.existingSecrets.findIndex((secret) => secret === value);
            setFieldValue('keyValues', keyValues[secretValueIndex]);
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
