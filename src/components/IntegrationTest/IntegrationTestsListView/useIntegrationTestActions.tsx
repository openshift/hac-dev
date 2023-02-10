import { IntegrationTestScenarioModel } from '../../../models';
import { Action } from '../../../shared/components/action-menu/types';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { useWorkspace } from '../../../utils/workspace-context-utils';
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
  const workspace = useWorkspace();
  return [
    {
      id: `edit-${integrationTest.metadata.name.toLowerCase()}`,
      label: 'Edit',
      cta: {
        href: `/stonesoup/workspaces/${workspace}/applications/${integrationTest.spec.application}/integrationtests/${integrationTest.metadata.name}/edit`,
      },
    },
    {
      cta: () => showModal(integrationTestDeleteModal(integrationTest)),
      id: `delete-${integrationTest.metadata.name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
