import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { isPACEnabled, startNewBuild } from '../../utils/component-utils';
import { createCustomizeComponentPipelineModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { componentDeleteModal } from '../modal/resource-modals';

export const useComponentActions = (component: ComponentKind, name: string): Action[] => {
  const showModal = useModalLauncher();
  const actions: Action[] = [
    {
      cta: () =>
        showModal(
          createCustomizeComponentPipelineModalLauncher(
            component.metadata.name,
            component.metadata.namespace,
          ),
        ),
      id: 'customize-build-pipeline',
      label: 'Customize build pipeline',
    },
  ];
  if (!isPACEnabled(component)) {
    actions.push({
      cta: () => startNewBuild(component),
      id: 'start-new-build',
      label: 'Start new build',
    });
  }
  actions.push(
    {
      cta: { href: `/stonesoup/component-settings?componentName=${name}` },
      id: 'component-settings',
      label: 'Edit component settings',
    },
    {
      cta: () => showModal(componentDeleteModal(component)),
      id: `delete-${name.toLowerCase()}`,
      label: 'Delete component',
    },
  );
  return actions;
};
