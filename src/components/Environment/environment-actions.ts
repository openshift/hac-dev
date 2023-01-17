import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { EnvironmentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { EnvironmentKind } from '../../types';
import { MVP_FLAG } from '../../utils/flag-utils';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { createEditStrategyModal } from './EditStrategyModal';
import { EnvironmentType, getEnvironmentType } from './environment-utils';

export const useEnvironmentActions = (environment: EnvironmentKind): Action[] => {
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);
  const showModal = useModalLauncher();
  const envType = getEnvironmentType(environment);
  return !mvpFeature && envType === EnvironmentType.static
    ? [
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
      ]
    : [];
};
