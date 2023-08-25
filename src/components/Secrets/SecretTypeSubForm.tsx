import React from 'react';
import { FormSection, PageSection, PageSectionVariants } from '@patternfly/react-core';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { useFormikContext } from 'formik';
import { DropdownField, InputField, RadioGroupField, SelectInputField } from '../../shared';
import { ImagePullSecretForm } from './ImagePullSecretForm';
import { KeyValueSecretForm } from './KeyValueSecretForm';
import {
  getSupportedPartnerTaskKeyValuePairs,
  getSupportedPartnerTaskSecrets,
  isPartnerTask,
} from './secret-utils';
import { SourceSecretForm } from './SourceSecretForm';
import { KeyValueEntry } from './utils/EncodedKeyValueUploadField';

export const enum SecretTarget {
  Build,
  Deployment,
}

type SecretFormValues = {
  target: SecretTarget;
  type: string;
  name: string;
  keyValues: KeyValueEntry[];
};

const secretTypes = [
  {
    key: 'key-value',
    label: 'Key/value secret',
    targets: [SecretTarget.Build, SecretTarget.Deployment],
    component: <KeyValueSecretForm />,
  },
  {
    key: 'image-pull',
    label: 'Image pull secret',
    targets: [SecretTarget.Build],
    component: <ImagePullSecretForm />,
  },
  {
    key: 'source',
    label: 'Source secret',
    targets: [SecretTarget.Build],
    component: <SourceSecretForm />,
  },
];

const supportedPartnerTaskSecrets = getSupportedPartnerTaskSecrets();
const defaultKeyValues = [{ key: '', value: '' }];

export const SecretTypeSubForm: React.FC = () => {
  const {
    values: { target, type: secretType, keyValues, name },
    setFieldValue,
  } = useFormikContext<SecretFormValues>();

  const dropdownItems = React.useMemo(
    () =>
      secretTypes
        .filter((t) => t.targets.includes(target))
        .map((t) => ({ key: t.key, value: t.label })),
    [target],
  );

  const selectedForm = React.useMemo(
    () => secretTypes.find((t) => t.label === secretType),
    [secretType],
  );

  // reset secret type if target changes
  React.useEffect(() => {
    if (target !== null) {
      setFieldValue('type', dropdownItems[0].value);
    }
  }, [target, setFieldValue, dropdownItems]);

  const clearKeyValues = React.useCallback(() => {
    const newKeyValues = keyValues.filter((kv) => !kv.readOnlyKey);
    setFieldValue('keyValues', [...(newKeyValues.length ? newKeyValues : defaultKeyValues)]);
  }, [keyValues, setFieldValue]);

  return (
    <PageSection variant={PageSectionVariants.light}>
      <FormSection>
        <RadioGroupField
          name="target"
          label="Secret for"
          options={[
            { label: 'Build', value: SecretTarget.Build },
            { label: 'Deployment', value: SecretTarget.Deployment },
          ]}
          required
        />
      </FormSection>
      <FormSection>
        <DropdownField
          name="type"
          label="Secret type"
          helpText="Tell us the secret type you want to add"
          items={dropdownItems}
          isDisabled={dropdownItems.length === 1}
          required
        />
      </FormSection>
      <FormSection>
        {target === SecretTarget.Build ? (
          <SelectInputField
            name="name"
            label="Secret name"
            toggleAriaLabel="Secret name"
            helpText="Unique name of the new secret"
            toggleId="secret-name-toggle"
            placeholderText="Enter name"
            variant={SelectVariant.typeahead}
            options={supportedPartnerTaskSecrets}
            isCreatable
            isInputValuePersisted
            hasOnCreateOption
            required
            onSelect={(_e, value) => {
              if (isPartnerTask(value)) {
                setFieldValue('keyValues', [
                  ...keyValues.filter((kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value)),
                  ...getSupportedPartnerTaskKeyValuePairs(value),
                ]);
              }
            }}
            onClear={() => {
              if (secretType === 'Image pull secret' && isPartnerTask(name)) {
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
      </FormSection>
      {selectedForm && selectedForm.component}
    </PageSection>
  );
};
