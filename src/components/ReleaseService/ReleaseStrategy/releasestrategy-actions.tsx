import { ReleaseStrategyModel } from '../../../models';
import { ReleaseStrategyKind } from '../../../types/release-strategy';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { createDeleteModalLauncher } from '../../modal/DeleteResourceModal';
import { useModalLauncher } from '../../modal/ModalProvider';

export const useReleaseStrategyActions = (obj: ReleaseStrategyKind) => {
  const showModal = useModalLauncher();
  const [canDelete] = useAccessReviewForModel(ReleaseStrategyModel, 'delete');
  return [
    {
      cta: () =>
        showModal(
          createDeleteModalLauncher(ReleaseStrategyModel.kind)({
            obj,
            model: ReleaseStrategyModel,
            displayName: obj.metadata.name,
          }),
        ),
      id: 'releaseplan-delete',
      label: 'Delete',
      disabled: !canDelete,
    },
  ];
};
