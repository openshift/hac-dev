import { useModalLauncher } from '../modal/ModalProvider';
import { createComponentRelationModal } from './ComponentRelationModal';

export const useComponentRelationAction = (application: string) => {
  const showModal = useModalLauncher();
  return () => ({
    key: 'component-relation-modal',
    label: 'Define component relationships',
    onClick: () => {
      showModal(createComponentRelationModal({ application }));
    },
  });
};
