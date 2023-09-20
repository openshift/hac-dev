import { ReleasePlanModel } from '../../../models';
import { ReleasePlanKind } from '../../../types/coreBuildService';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { createDeleteModalLauncher } from '../../modal/DeleteResourceModal';
import { useModalLauncher } from '../../modal/ModalProvider';

export const useReleasePlanActions = (obj: ReleasePlanKind) => {
  const showModal = useModalLauncher();
  const [canDelete] = useAccessReviewForModel(ReleasePlanModel, 'delete');
  return [
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
      label: 'Delete',
      disabled: !canDelete,
    },
  ];
};
