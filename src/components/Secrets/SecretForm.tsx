import React, { useMemo } from 'react';
import { Form } from '@patternfly/react-core';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { useFormikContext } from 'formik';
import { DropdownItemObject, SelectInputField } from '../../shared';
import KeyValueFileInputField from '../../shared/components/formik-fields/key-value-file-input-field/KeyValueFileInputField';
import {
  SecretFormValues,
  SecretTypeDropdownLabel,
  K8sSecretType,
  ExistingSecret,
} from '../../types';
import { RawComponentProps } from '../modal/createModalLauncher';
import SecretTypeSelector from './SecretTypeSelector';
import {
  supportedPartnerTasksSecrets,
  getSupportedPartnerTaskKeyValuePairs,
  isPartnerTask,
} from './utils/secret-utils';

type SecretFormProps = RawComponentProps & {
  existingSecrets: ExistingSecret[];
};

const SecretForm: React.FC<React.PropsWithChildren<SecretFormProps>> = ({ existingSecrets }) => {
  const { values, setFieldValue } = useFormikContext<SecretFormValues>();
  const [currentType, setType] = React.useState(values.type);
  const defaultKeyValues = [{ key: '', value: '', readOnlyKey: false }];
  const defaultImageKeyValues = [{ key: '.dockerconfigjson', value: '', readOnlyKey: true }];

  let options = useMemo(() => {
    return existingSecrets
      .filter((secret) => secret.type === K8sSecretType[currentType])
      .concat(
        currentType === SecretTypeDropdownLabel.opaque &&
          existingSecrets.find((s) => s.name === 'snyk-secret') === undefined
          ? [supportedPartnerTasksSecrets.snyk]
          : [],
      )
      .filter((secret) => secret.type !== K8sSecretType[SecretTypeDropdownLabel.image])
      .map((secret) => ({ value: secret.name, lable: secret.name }));
  }, [currentType, existingSecrets]);
  const optionsValues = useMemo(() => {
    return existingSecrets
      .filter((secret) => secret.type === K8sSecretType[currentType])
      .filter((secret) => secret.type !== K8sSecretType[SecretTypeDropdownLabel.image])
      .reduce(
        (dictOfSecrets, secret) => {
          dictOfSecrets[secret.name] = secret;
          return dictOfSecrets;
        },
        { 'snyk-secret': supportedPartnerTasksSecrets.snyk },
      );
  }, [currentType, existingSecrets]);

  const clearKeyValues = () => {
    const newKeyValues = values.keyValues.filter((kv) => !kv.readOnlyKey);
    setFieldValue('keyValues', [...(newKeyValues.length ? newKeyValues : defaultKeyValues)]);
  };

  const resetKeyValues = () => {
    options = [];
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
          setType(type);
          if (type === SecretTypeDropdownLabel.image) {
            resetKeyValues();
            values.secretName &&
              isPartnerTask(values.secretName, optionsValues) &&
              setFieldValue('secretName', '');
          } else {
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
          if (currentType !== values.type || isPartnerTask(values.secretName, optionsValues)) {
            clearKeyValues();
          }
        }}
        onSelect={(e, value) => {
          if (isPartnerTask(value, optionsValues)) {
            setFieldValue('keyValues', [
              ...values.keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value)),
              ...getSupportedPartnerTaskKeyValuePairs(value, optionsValues),
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
