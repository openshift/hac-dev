import { Action } from '../../shared/components/action-menu/types';
import { ApplicationKind } from '../../types';
import { useModalLauncher } from '../modal/ModalProvider';
import { applicationDeleteModal } from '../modal/resource-modals';

export const useApplicationActions = (application: ApplicationKind): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: () => showModal(applicationDeleteModal(application)),
      id: `delete-${application.metadata.name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
