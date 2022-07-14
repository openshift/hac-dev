import { EnvironmentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { EnvironmentKind } from '../../types';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { useModalLauncher } from '../modal/ModalProvider';

export const useEnvironmentActions = (environment: EnvironmentKind): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: () =>
        showModal(
          createDeleteModalLauncher(environment.kind)({
            obj: environment,
            model: EnvironmentModel,
          }),
        ),
      id: `delete-${environment.metadata.name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
