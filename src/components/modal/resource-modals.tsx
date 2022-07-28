import * as React from 'react';
import { ApplicationModel, ComponentModel } from '../../models';
import { ApplicationKind, ComponentKind } from '../../types';
import { createDeleteModalLauncher } from './DeleteResourceModal';

export const applicationDeleteModal = (applicationObj: ApplicationKind) =>
  createDeleteModalLauncher(applicationObj.kind)({
    obj: applicationObj,
    model: ApplicationModel,
    displayName: applicationObj.spec.displayName,
  });

export const componentDeleteModal = (component: ComponentKind) =>
  createDeleteModalLauncher(component.kind)({
    obj: component,
    model: ComponentModel,
    description: (
      <>
        The component <strong>{component.metadata.name}</strong> will be deleted from the components
        view and all the environments it is currently deployed.
      </>
    ),
  });
