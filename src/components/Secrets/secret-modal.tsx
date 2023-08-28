import * as React from 'react';
import { RemoteSecretModel } from '../../models';
import { RemoteSecretKind } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';

export const secretDeleteModal = (secret: RemoteSecretKind) =>
  createDeleteModalLauncher(secret.kind)({
    obj: secret,
    model: RemoteSecretModel,
    displayName: secret.metadata.name,
    description: (
      <>
        The secret <strong>{secret.metadata.name}</strong> and its value will be deleted from all
        the environments it is attached to.
      </>
    ),
  });
