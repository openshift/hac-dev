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
} from './secret-utils';

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
  const keyValues = getSupportedPartnerTaskKeyValuePairs();
  const options = getSupportedPartnerTaskSecrets().filter(
    (secret) => !existingSecrets.includes(secret.value),
  );

  const initialValues: SecretFormValues = { secretName: '', keyValues, existingSecrets };
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
          description="Keep your data secure by defining a build time secret."
          variant={ModalVariant.medium}
          width={'40%'}
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
            <Alert isInline title="At this time RHTAP only support Opaque secret types" />
          </ModalBoxHeader>
          <ModalBoxBody>
            <Form>
              <SelectInputField
                required
                name={'secretName'}
                label="Select or enter name"
                helpText="Unique name of the new secret."
                isCreatable
                hasOnCreateOption
                options={options}
                variant={SelectVariant.typeahead}
                onClear={() => {
                  props.setFieldValue('keyValues', getSupportedPartnerTaskKeyValuePairs());
                }}
                onSelect={(e, value) => {
                  props.setFieldValue('secretName', value);
                  props.setFieldValue('keyValues', getSupportedPartnerTaskKeyValuePairs(value));
                }}
              />
              <KeyValueFileInputField
                name="keyValues"
                data-test="configmap-key-value-pair"
                entries={keyValues}
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
