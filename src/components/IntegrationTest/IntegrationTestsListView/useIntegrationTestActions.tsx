import { IntegrationTestScenarioModel } from '../../../models';
import { Action } from '../../../shared/components/action-menu/types';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { createDeleteModalLauncher } from '../../modal/DeleteResourceModal';
import { useModalLauncher } from '../../modal/ModalProvider';

export const integrationTestDeleteModal = (integrationTestObj: IntegrationTestScenarioKind) =>
  createDeleteModalLauncher(integrationTestObj.kind)({
    obj: integrationTestObj,
    model: IntegrationTestScenarioModel,
    displayName: integrationTestObj.metadata.name,
  });

export const integrationTestDeleteModalAndNavigate = (
  integrationTestObj: IntegrationTestScenarioKind,
) =>
  createDeleteModalLauncher(integrationTestObj.kind)({
    obj: integrationTestObj,
    model: IntegrationTestScenarioModel,
    displayName: integrationTestObj.metadata.name,
    isEntryNotRequired: true,
  });

export const useIntegrationTestActions = (
  integrationTest: IntegrationTestScenarioKind,
): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      id: `edit-${integrationTest.metadata.name.toLowerCase()}`,
      label: 'Edit',
      cta: { href: `/stonesoup/integration-test/${integrationTest.metadata.name}/edit` },
    },
    {
      cta: () => showModal(integrationTestDeleteModal(integrationTest)),
      id: `delete-${integrationTest.metadata.name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
