import { SpaceBindingRequestModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { SpaceBindingRequest } from '../../types';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import { useModalLauncher } from '../modal/ModalProvider';
import { RevokeAccessModal } from './RevokeAccessModal';

const revokeAccessModalLauncher = (sbr: SpaceBindingRequest) =>
  createRawModalLauncher(RevokeAccessModal, {
    'data-testid': 'revoke-access-modal',
    title: 'Revoke access?',
    titleIconVariant: 'warning',
  })({ sbr });

export const useSBRActions = (sbr: SpaceBindingRequest): Action[] => {
  const showModal = useModalLauncher();
  const [canDeleteSBR] = useAccessReviewForModel(SpaceBindingRequestModel, 'delete');
  const [canUpdateSBR] = useAccessReviewForModel(SpaceBindingRequestModel, 'update');
  const { workspace } = useWorkspaceInfo();

  return [
    {
      label: 'Edit access',
      id: `edit-access-${sbr.metadata.name}`,
      disabled: !canUpdateSBR,
      disabledTooltip: "You don't have permisison to edit access",
      cta: {
        href: `/application-pipeline/access/workspaces/${workspace}/edit/${sbr.metadata.name}`,
      },
    },
    {
      cta: () => showModal(revokeAccessModalLauncher(sbr)),
      id: `revoke-access-${sbr.metadata.name}`,
      label: 'Revoke access',
      disabled: !canDeleteSBR,
      disabledTooltip: "You don't have permisison to revoke access",
    },
  ];
};
