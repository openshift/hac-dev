import { RemoteSecretModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { RemoteSecretKind } from '../../types';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useModalLauncher } from '../modal/ModalProvider';
import { secretDeleteModal } from './secret-modal';

export const useSecretActions = (secret: RemoteSecretKind): Action[] => {
  const showModal = useModalLauncher();
  const [canDelete] = useAccessReviewForModel(RemoteSecretModel, 'delete');
  return [
    {
      cta: () => showModal(secretDeleteModal(secret)),
      id: `delete-${secret.metadata.name.toLowerCase()}`,
      label: 'Delete',
      disabled: !canDelete,
      disabledTooltip: "You don't have access to delete this secret",
    },
  ];
};
