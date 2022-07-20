import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { useModalLauncher } from '../modal/ModalProvider';
import { componentDeleteModal } from '../modal/resource-modals';

export const useComponentActions = (component: ComponentKind, name: string): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: { href: `/app-studio/component-settings?componentName=${name}` },
      id: 'component-settings',
      label: 'Component settings',
    },
    {
      cta: () => showModal(componentDeleteModal(component)),
      id: `delete-${name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
