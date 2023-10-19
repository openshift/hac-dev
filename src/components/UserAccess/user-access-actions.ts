import { Action } from '../../shared/components/action-menu/types';
import { WorkspaceBinding } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { RevokeAccessModal } from './RevokeAccessModal';

const revokeAccessModalLauncher = (username: string, sbr: WorkspaceBinding['bindingRequest']) =>
  createRawModalLauncher(RevokeAccessModal, {
    'data-testid': 'revoke-access-modal',
    title: 'Revoke access?',
    titleIconVariant: 'warning',
  })({ username, sbr });

export const useSBRActions = (binding: WorkspaceBinding): Action[] => {
  const showModal = useModalLauncher();
  const { workspace } = useWorkspaceInfo();
  const canDeleteSBR = binding.availableActions?.includes('delete') && binding.bindingRequest;
  const canUpdateSBR = binding.availableActions?.includes('update') && binding.bindingRequest;

  return [
    {
      label: 'Edit access',
      id: `edit-access-${binding.masterUserRecord}`,
      disabled: !canUpdateSBR,
      disabledTooltip: "You don't have permission to edit access",
      cta: {
        href: `/application-pipeline/access/workspaces/${workspace}/edit/${binding.masterUserRecord}`,
      },
    },
    {
      cta: () =>
        showModal(revokeAccessModalLauncher(binding.masterUserRecord, binding.bindingRequest)),
      id: `revoke-access-${binding.masterUserRecord}`,
      label: 'Revoke access',
      disabled: !canDeleteSBR,
      disabledTooltip: "You don't have permission to revoke access",
    },
  ];
};
