import { EnvironmentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { EnvironmentKind } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { createEditStrategyModal } from './EditStrategyModal';

export const useEnvironmentActions = (environment: EnvironmentKind): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: () =>
        showModal(
          createEditStrategyModal({
            obj: environment,
          }),
        ),
      id: `edit-strategy-${environment.metadata.name.toLowerCase()}`,
      label: 'Edit deployment strategy',
    },
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
    },
  ];
};
