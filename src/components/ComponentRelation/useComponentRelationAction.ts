import { useComponents } from '../../hooks/useComponents';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { useModalLauncher } from '../modal/ModalProvider';
import { createComponentRelationModal } from './ComponentRelationModal';

export const useComponentRelationAction = (application: string) => {
  const showModal = useModalLauncher();
  const { namespace } = useWorkspaceInfo();
  const [components, loaded, error] = useComponents(namespace, application);
  return () => ({
    key: 'component-relation-modal',
    label: 'Define component relationships',
    onClick: () => {
      showModal(createComponentRelationModal({ application }));
    },
    isDisabled: loaded && !error ? components.length < 2 : false,
  });
};
