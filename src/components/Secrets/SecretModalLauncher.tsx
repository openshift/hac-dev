import { ModalVariant } from '@patternfly/react-core';
import { SecretFormValues } from '../../types';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import SecretForm from './SecretModal';

export const SecretModalLauncher = (
  existingSecrets?: string[],
  onSubmit?: (values: SecretFormValues) => void,
  onClose?: () => void,
) =>
  createRawModalLauncher(SecretForm, {
    'data-testid': 'create-secret-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
    onClose,
  })({ onSubmit, existingSecrets });
