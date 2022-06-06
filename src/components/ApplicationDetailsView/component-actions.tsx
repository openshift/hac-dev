import * as React from 'react';
import { ComponentModel } from '../../models';
import { Action } from '../../shared/components/action-menu/types';
import { ComponentKind } from '../../types';
import { buildLogViewerLauncher } from '../LogViewer/BuildLogViewer';
import { createDeleteModalLauncher } from '../modal/DeleteResourceModal';
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
      cta: () =>
        showModal(
          createDeleteModalLauncher(component.kind)({
            obj: component,
            model: ComponentModel,
            description: (
              <>
                The component <strong>{component.metadata.name}</strong> will be deleted from the
                components view and all the environments it is currently deployed.
              </>
            ),
          }),
        ),
      id: `delete-${name.toLowerCase()}`,
      label: 'Delete',
    },
  ];
};
