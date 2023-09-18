import { ReleasePlanAdmissionModel } from '../../../models/release-plan-admission';
import { ReleasePlanAdmissionKind } from '../../../types/release-plan-admission';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { createDeleteModalLauncher } from '../../modal/DeleteResourceModal';
import { useModalLauncher } from '../../modal/ModalProvider';

export const useReleasePlanAdmissionActions = (obj: ReleasePlanAdmissionKind) => {
  const showModal = useModalLauncher();
  const [canDelete] = useAccessReviewForModel(ReleasePlanAdmissionModel, 'delete');
  return [
    {
      cta: () =>
        showModal(
          createDeleteModalLauncher(ReleasePlanAdmissionModel.kind)({
            obj,
            model: ReleasePlanAdmissionModel,
            displayName: obj.metadata.name,
          }),
        ),
      id: 'releaseplanadmission-delete',
      label: 'Delete',
      disabled: !canDelete,
    },
  ];
};
