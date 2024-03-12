import { ReleaseModel, ReleasePlanModel } from '../../../models';
import { ReleasePlanKind } from '../../../types/coreBuildService';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { createDeleteModalLauncher } from '../../modal/DeleteResourceModal';
import { useModalLauncher } from '../../modal/ModalProvider';

export const useReleasePlanActions = (obj: ReleasePlanKind) => {
  const showModal = useModalLauncher();
  const { workspace } = useWorkspaceInfo();
  const [canDelete] = useAccessReviewForModel(ReleasePlanModel, 'delete');
  const [canUpdate] = useAccessReviewForModel(ReleasePlanModel, 'update');
  const [canTrigger] = useAccessReviewForModel(ReleaseModel, 'create');

  return [
    {
      label: 'Trigger release plan',
      id: `trigger-releaseplan-${obj.metadata.name}`,
      cta: {
        href: `/application-pipeline/release/workspaces/${workspace}/release-plan/trigger`,
      },
      disabled: !canTrigger,
      disabledTooltip: "You don't have permission to trigger this release plan",
    },
    {
      label: 'Edit release plan',
      id: `edit-releaseplan-${obj.metadata.name}`,
      disabled: !canUpdate,
      disabledTooltip: "You don't have permission to edit this release plan",
      cta: {
        href: `/application-pipeline/release/workspaces/${workspace}/release-plan/edit/${obj.metadata.name}`,
      },
    },
    {
      cta: () =>
        showModal(
          createDeleteModalLauncher(ReleasePlanModel.kind)({
            obj,
            model: ReleasePlanModel,
            displayName: obj.metadata.name,
          }),
        ),
      id: 'releaseplan-delete',
      label: 'Delete release plan',
      disabled: !canDelete,
      disabledTooltip: "You don't have permission to delete this release plan",
    },
  ];
};
