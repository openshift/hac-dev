import React from 'react';
import {
  Alert,
  Button,
  Form,
  Modal,
  ModalBoxBody,
  ModalBoxHeader,
  ModalVariant,
  SelectVariant,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import { SelectInputField } from '../../shared';
import KeyValueFileInputField from '../../shared/components/formik-fields/key-value-file-input-field/KeyValueFileInputField';
import { ImportSecret } from '../ImportForm/utils/types';
import { SecretFromSchema } from '../ImportForm/utils/validation-utils';
import { RawComponentProps } from '../modal/createModalLauncher';
import {
  getSupportedPartnerTaskKeyValuePairs,
  getSupportedPartnerTaskSecrets,
  isPartnerTask,
} from './secret-utils';

import './OpaqueSecretForm.scss';

const createPartnerTaskSecret = (secret, onSubmit, onClose) => {
  onSubmit && onSubmit(secret);
  onClose({ submitClicked: true });
};

export type SecretFormValues = ImportSecret & {
  existingSecrets: string[];
};

type OpaqueSecretFormProps = RawComponentProps & {
  existingSecrets: string[];
  onSubmit: (value: SecretFormValues) => void;
};

const OpaqueSecretForm: React.FC<OpaqueSecretFormProps> = ({
  modalProps,
  onSubmit,
  existingSecrets,
}) => {
  const defaultKeyValues = [{ key: '', value: '', readOnlyKey: false }];
  const options = getSupportedPartnerTaskSecrets().filter(
    (secret) => !existingSecrets.includes(secret.value),
  );

  const initialValues: SecretFormValues = {
    secretName: '',
    keyValues: defaultKeyValues,
    existingSecrets,
  };
  return (
    <Formik
      onSubmit={(v) => createPartnerTaskSecret(v, onSubmit, modalProps.onClose)}
      initialValues={initialValues}
      validationSchema={SecretFromSchema}
    >
      {(props) => (
        <Modal
          {...modalProps}
          title="Create new build secret"
          description="Keep your data secure with a build-time secret."
          variant={ModalVariant.medium}
          data-testid="opaque-secret-modal"
          className="opaque-secret-modal"
          actions={[
            <Button
              key="confirm"
              variant="primary"
              type="submit"
              onClick={() => {
                props.handleSubmit();
              }}
            >
              Create
            </Button>,
            <Button key="cancel" variant="link" onClick={modalProps.onClose}>
              Cancel
            </Button>,
          ]}
        >
          <ModalBoxHeader>
            <Alert
              isInline
              title="For now we only support Opaque secret types, but we’ll be expanding to more types in the future."
            />
          </ModalBoxHeader>
          <ModalBoxBody>
            <Form>
              <SelectInputField
                required
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
                  const newKeyValues = props.values.keyValues.filter((kv) => !kv.readOnlyKey);
                  props.setFieldValue('keyValues', [
                    ...(newKeyValues.length ? newKeyValues : defaultKeyValues),
                  ]);
                }}
                onSelect={(e, value) => {
                  if (isPartnerTask(value)) {
                    props.setFieldValue('keyValues', [
                      ...props.values.keyValues.filter(
                        (kv) => !kv.readOnlyKey && (!!kv.key || !!kv.value),
                      ),
                      ...getSupportedPartnerTaskKeyValuePairs(value),
                    ]);
                  } else {
                    const newKeyValues = props.values.keyValues.filter((kv) => !kv.readOnlyKey);
                    props.setFieldValue('keyValues', [
                      ...(newKeyValues.length ? newKeyValues : defaultKeyValues),
                    ]);
                  }
                  props.setFieldValue('secretName', value);
                }}
              />
              <KeyValueFileInputField
                name="keyValues"
                data-test="secret-key-value-pair"
                entries={defaultKeyValues}
                disableRemoveAction={props.values.keyValues.length === 1}
              />
            </Form>
          </ModalBoxBody>
        </Modal>
      )}
    </Formik>
  );
};

export default OpaqueSecretForm;
