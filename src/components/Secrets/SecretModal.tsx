import * as React from 'react';
import {
  Alert,
  Button,
  Modal,
  ModalBoxBody,
  ModalBoxHeader,
  ModalVariant,
} from '@patternfly/react-core';
import { Formik } from 'formik';
import { SecretTypeDropdownLabel } from '../../types';
import { ImportSecret } from '../ImportForm/utils/types';
import { SecretFromSchema } from '../ImportForm/utils/validation-utils';
import { RawComponentProps } from '../modal/createModalLauncher';
import SecretForm from './SecretForm';

import './SecretModal.scss';

const createPartnerTaskSecret = (
  secret: ImportSecret,
  onSubmit: (v: ImportSecret) => void,
  onClose: (event: KeyboardEvent | React.MouseEvent) => void,
) => {
  onSubmit && onSubmit(secret);
  onClose(null);
};

export type SecretModalValues = ImportSecret & {
  existingSecrets: string[];
};

type SecretModalProps = RawComponentProps & {
  existingSecrets: string[];
  onSubmit: (value: SecretModalValues) => void;
};

const SecretModal: React.FC<SecretModalProps> = ({ modalProps, onSubmit, existingSecrets }) => {
  const defaultKeyValues = [{ key: '', value: '', readOnlyKey: false }];
  const initialValues: SecretModalValues = {
    secretName: '',
    type: SecretTypeDropdownLabel.opaque,
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
          data-testid="build-secret-modal"
          className="build-secret-modal"
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
              title="For now we only support Opaque secret and Image pull secret types, but we’ll be expanding to more types in the future."
            />
          </ModalBoxHeader>
          <ModalBoxBody>
            <SecretForm existingSecrets={existingSecrets} />
          </ModalBoxBody>
        </Modal>
      )}
    </Formik>
  );
};

export default SecretModal;
