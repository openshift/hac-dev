import { ComponentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { isPACEnabled, startNewBuild } from '../../utils/component-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeComponentPipelineModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { componentDeleteModal } from '../modal/resource-modals';

export const useComponentActions = (component: ComponentKind, name: string): Action[] => {
  const { workspace } = useWorkspaceInfo();
  const showModal = useModalLauncher();
  const applicationName = component.spec.application;
  const [canUpdateComponent] = useAccessReviewForModel(ComponentModel, 'update');
  const [canPatchComponent] = useAccessReviewForModel(ComponentModel, 'patch');
  const [canDeleteComponent] = useAccessReviewForModel(ComponentModel, 'delete');

  const actions: Action[] = [
    {
      cta: () =>
        showModal(
          createCustomizeComponentPipelineModalLauncher(
            component.metadata.name,
            component.metadata.namespace,
          ),
        ),
      id: 'manage-build-pipeline',
      label: 'Manage build pipeline',
    },
  ];
  if (!isPACEnabled(component)) {
    actions.push({
      cta: () => startNewBuild(component),
      id: 'start-new-build',
      label: 'Start new build',
      disabled: !canPatchComponent,
      disabledTooltip: "You don't have access to start a new build",
    });
  }
  actions.push(
    {
      cta: {
        href: `/stonesoup/workspaces/${workspace}/applications/${applicationName}/component-settings?componentName=${name}`,
      },
      id: 'component-settings',
      label: 'Edit component settings',
      disabled: !canUpdateComponent,
      disabledTooltip: "You don't have access to edit component settings",
    },
    {
      cta: () => showModal(componentDeleteModal(component)),
      id: `delete-${name.toLowerCase()}`,
      label: 'Delete component',
      disabled: !canDeleteComponent,
      disabledTooltip: "You don't have access to delete a component",
    },
  );
  return actions;
};
