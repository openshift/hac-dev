import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { deleteComponent } from '../../utils/delete-utils';
import { buildLogViewerLauncher } from '../LogViewer/BuildLogViewer';
import { useModalLauncher } from '../modal/ModalProvider';

export const useComponentActions = (component: ComponentKind, name: string): Action[] => {
  const showModal = useModalLauncher();
  return [
    {
      cta: { href: `/app-studio/component-settings?componentName=${name}` },
      id: 'component-settings',
      label: 'Component settings',
    },
    {
      cta: () =>
        showModal(
          buildLogViewerLauncher({
            component,
          }),
        ),
      id: `view-logs-${name.toLowerCase()}`,
      label: 'View Build Logs',
    },
    {
      cta: () => deleteComponent(name, component.metadata.namespace),
      id: `delete-${name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
