import React from 'react';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { useFormikContext } from 'formik';
import { DropdownItemObject, InputField, RadioGroupField, SelectInputField } from '../../../shared';
import KeyValueField from '../../../shared/components/formik-fields/key-value-input-field/KeyValueInputField';
import { AddSecretFormValues, SecretFor, SecretTypeDropdownLabel } from '../../../types';
import SecretTypeSelector from '../SecretTypeSelector';
import {
  getSupportedPartnerTaskKeyValuePairs,
  getSupportedPartnerTaskSecrets,
  isPartnerTask,
  isPartnerTaskAvailable,
} from '../utils/secret-utils';
import { ApplicationDropdown } from './ApplicationDropdown';
import { ComponentDropdown } from './ComponentDropdown';
import { EnvironmentDropdown } from './EnvironmentDropdown';
import { ImagePullSecretForm } from './ImagePullSecretForm';
import { KeyValueSecretForm } from './KeyValueSecretForm';
import { SourceSecretForm } from './SourceSecretForm';

const secretTypes = [
  {
    key: 'key-value',
    label: SecretTypeDropdownLabel.opaque,
    targets: [SecretFor.Build, SecretFor.Deployment],
    component: <KeyValueSecretForm />,
  },
  {
    key: 'image-pull',
    label: SecretTypeDropdownLabel.image,
    targets: [SecretFor.Build],
    component: <ImagePullSecretForm />,
  },
  {
    key: 'source',
    label: SecretTypeDropdownLabel.source,
    targets: [SecretFor.Build],
    component: <SourceSecretForm />,
  },
];

const supportedPartnerTaskSecrets = getSupportedPartnerTaskSecrets();
const defaultKeyValues = [{ key: '', value: '' }];

export const SecretTypeSubForm: React.FC = () => {
  const {
    values: {
      name,
      type: secretType,
      secretFor,
      opaque: { keyValues },
    },
    setFieldValue,
    validateForm,
  } = useFormikContext<AddSecretFormValues>();

  const existingSecrets = [];

  const initialOptions = supportedPartnerTaskSecrets.filter(
    (secret) => !existingSecrets.includes(secret.value),
  );

  const [options, setOptions] = React.useState(initialOptions);
  const currentTypeRef = React.useRef(secretType);

  const selectedForm = React.useMemo(
    () => secretTypes.find((t) => t.label === secretType),
    [secretType],
  );

  const clearKeyValues = React.useCallback(() => {
    const newKeyValues = keyValues.filter((kv) => !kv.readOnlyKey);
    setFieldValue('opaque.keyValues', [...(newKeyValues.length ? newKeyValues : defaultKeyValues)]);
  }, [keyValues, setFieldValue]);

  const resetKeyValues = () => {
    setOptions([]);
    const newKeyValues = keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value));
    setFieldValue('opaque.keyValues', [...newKeyValues]);
  };

  const availableTypes = React.useMemo(
    () => secretTypes.filter((t) => t.targets.includes(secretFor)).map((t) => t.label),
    [secretFor],
  );
  const dropdownItems: DropdownItemObject[] = Object.entries(SecretTypeDropdownLabel).reduce(
    (acc, [key, value]) => {
      if (availableTypes.includes(value)) {
        acc.push({ key, value });
      }
      return acc;
    },
    [],
  );

  return (
    <>
      <RadioGroupField
        name="secretFor"
        label="Secret for"
        options={[
          { label: 'Build', value: SecretFor.Build },
          { label: 'Deployment', value: SecretFor.Deployment },
        ]}
        onChange={(type) => {
          setFieldValue('secretFor', type);
          setFieldValue('type', availableTypes[0]);
          if (type === SecretFor.Deployment) {
            name && isPartnerTask(name) && setFieldValue('name', '');
            clearKeyValues();
          }
        }}
        required
      />
      <SecretTypeSelector
        key={secretFor}
        dropdownItems={dropdownItems}
        isDisabled={secretFor === SecretFor.Deployment}
        onChange={(type) => {
          setTimeout(() => validateForm());
          currentTypeRef.current = type;
          if (type !== SecretTypeDropdownLabel.opaque) {
            resetKeyValues();
            name && isPartnerTask(name) && setFieldValue('name', '');
          } else {
            setOptions(initialOptions);
            clearKeyValues();
          }
        }}
      />
      {secretFor === SecretFor.Build && isPartnerTaskAvailable(currentTypeRef.current) ? (
        <SelectInputField
          name="name"
          label="Secret name"
          toggleAriaLabel="Secret name"
          helpText="Unique name of the new secret"
          toggleId="secret-name-toggle"
          placeholderText="Enter name"
          variant={SelectVariant.typeahead}
          options={options}
          isCreatable
          isInputValuePersisted
          hasOnCreateOption
          required
          onSelect={(_e, value) => {
            if (isPartnerTask(value)) {
              setFieldValue('opaque.keyValues', [
                ...keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value)),
                ...getSupportedPartnerTaskKeyValuePairs(value),
              ]);
            }
          }}
          onClear={() => {
            if (isPartnerTask(name)) {
              clearKeyValues();
            }
          }}
        />
      ) : (
        <InputField
          name="name"
          label="Secret name"
          helpText="Unique name of the new secret"
          placeholder="Enter name"
          required
        />
      )}

      {secretFor === SecretFor.Deployment && (
        <>
          <ApplicationDropdown
            name="targets.application"
            helpText="The secret key and its value will be associated with the selected target"
            required
          />
          <ComponentDropdown
            name="targets.component"
            helpText="The secret key and its value will be associated with the selected target"
          />
          <EnvironmentDropdown
            name="targets.environment"
            helpText="The secret key and its value will be associated with the selected target"
            required
          />
        </>
      )}
      {selectedForm && selectedForm.component}
      <KeyValueField
        name="labels"
        label="Labels"
        entries={[{ name: '', value: '' }]}
        description="You can add labels to provide more context or tag your secret."
      />
    </>
  );
};
