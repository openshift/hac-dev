import { ApplicationModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { ApplicationKind } from '../../types';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';

export const useApplicationActions = (application: ApplicationKind): Action[] => {
  const showModal = useModalLauncher();
  const [canDelete] = useAccessReviewForModel(ApplicationModel, 'delete');
  return [
    {
      cta: () => showModal(applicationDeleteModal(application)),
      id: `delete-${application.metadata.name.toLowerCase()}`,
      label: 'Delete application',
      disabled: !canDelete,
      disabledTooltip: "You don't have access to delete this application",
    },
  ];
};
