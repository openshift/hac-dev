import * as React from 'react';
import { SecretModel } from '../../models';
import { SecretKind, SecretTypeDisplayLabel } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { typeToLabel } from './utils/secret-utils';
import { unLinkSecretFromServiceAccount } from './utils/service-account-utils';

export const secretDeleteModal = (secret: SecretKind) =>
  createDeleteModalLauncher(secret.kind)({
    obj: secret,
    model: SecretModel,
    submitCallback:
      typeToLabel(secret.type) === SecretTypeDisplayLabel.imagePull
        ? unLinkSecretFromServiceAccount
        : null,
    displayName: secret.metadata.name,
    description: (
      <>
        The secret <strong>{secret.metadata.name}</strong> and its value will be deleted from all
        the environments it is attached to.
      </>
    ),
  });
