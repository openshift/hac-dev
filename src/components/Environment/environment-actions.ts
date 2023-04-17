import { EnvironmentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { EnvironmentKind } from '../../types';
import { useAccessReviewForModel } from '../../utils/rbac';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { useModalLauncher } from '../modal/ModalProvider';
// import { createEditStrategyModal } from './EditStrategyModal';
import { EnvironmentType, getEnvironmentType } from './environment-utils';

export const useEnvironmentActions = (environment: EnvironmentKind): Action[] => {
  const showModal = useModalLauncher();
  const envType = getEnvironmentType(environment);
  // const [canPatchEnvironment] = useAccessReviewForModel(EnvironmentModel, 'patch');
  const [canDeleteEnvironment] = useAccessReviewForModel(EnvironmentModel, 'delete');

  return envType !== EnvironmentType.default
    ? [
        {
          cta: () =>
            showModal(
              createDeleteModalLauncher(environment.kind)({
                obj: environment,
                model: EnvironmentModel,
                displayName: environment.spec.displayName,
              }),
            ),
          id: `delete-${environment.metadata.name.toLowerCase()}`,
          label: 'Delete',
          disabled: !canDeleteEnvironment,
          disabledTooltip: "You don't have access to delete this environment",
        },
        // For summit we only have automatic BYOC enviuronments.
        // {
        //   cta: () =>
        //     showModal(
        //       createEditStrategyModal({
        //         obj: environment,
        //       }),
        //     ),
        //   id: `edit-strategy-${environment.metadata.name.toLowerCase()}`,
        //   label: 'Edit deployment strategy',
        //   disabled: !canPatchEnvironment,
        //   disabledTooltip: "You don't have access to edit the deployment strategy",
        // },
      ]
    : [];
};
