import { ApplicationModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { ApplicationKind } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { useModalLauncher } from '../modal/ModalProvider';

export const useApplicationActions = (application: ApplicationKind): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: () =>
        showModal(
          createDeleteModalLauncher(application.kind)({
            obj: application,
            model: ApplicationModel,
          }),
        ),
      id: `delete-${application.metadata.name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
