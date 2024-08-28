import { Action } from '../../shared/components/action-menu/types';
import { KonfluxWorkspace } from '../../types';
import { WorkspaceLabels } from '../ContextSwitcher/context-switcher-utils';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { ChangeVisibilityModal } from './ChangeVisibilityModal';

const changeVisibilityModalLauncher = (workspace: KonfluxWorkspace) =>
  createRawModalLauncher(ChangeVisibilityModal, {
    'data-testid': 'revoke-access-modal',
    title: 'Change visibility?',
    titleIconVariant: 'warning',
  })({ workspace });

export const useWorkspaceActions = (workspace: KonfluxWorkspace): Action[] => {
  const showModal = useModalLauncher();
  const isOwner = workspace?.metadata?.labels[WorkspaceLabels.IS_OWNER];

  return [
    {
      cta: () => showModal(changeVisibilityModalLauncher(workspace)),
      id: `change-visibility`,
      label: 'Change visibility',
      disabled: isOwner !== 'true',
      disabledTooltip: "You don't have permission to change the visibility",
    },
  ];
};
