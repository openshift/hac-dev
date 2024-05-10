import * as React from 'react';
import { SecretModel } from '../../models';
import { SecretKind } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';

export const secretDeleteModal = (secret: SecretKind) =>
  createDeleteModalLauncher(secret.kind)({
    obj: secret,
    model: SecretModel,
    displayName: secret.metadata.name,
    description: (
      <>
        The secret <strong>{secret.metadata.name}</strong> and its value will be deleted from all
        the environments it is attached to.
      </>
    ),
  });
