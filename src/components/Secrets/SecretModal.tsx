import { ModalVariant } from '@patternfly/react-core';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import OpaqueSecretForm, { SecretFormValues } from './OpaqueSecretForm';

export const SecretModal = (
  existingSecrets?: string[],
  onSubmit?: (values: SecretFormValues) => void,
  onClose?: () => void,
) =>
  createRawModalLauncher(OpaqueSecretForm, {
    'data-testid': 'create-secret-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
    onClose,
  })({ onSubmit, existingSecrets });
