import * as React from 'react';
import { ApplicationModel, ComponentModel } from '../../models';
import { ApplicationKind, ComponentKind } from '../../types';
import { createDeleteModalLauncher } from './DeleteResourceModal';

export const applicationDeleteModal = (applicationObj: ApplicationKind) =>
  createDeleteModalLauncher(applicationObj.kind)({
    obj: applicationObj,
    model: ApplicationModel,
    displayName: applicationObj.spec.displayName || applicationObj.metadata.name,
    description: (
      <>
        The application{' '}
        <strong>{applicationObj.spec.displayName || applicationObj.metadata.name}</strong> will be
        deleted permanently with all of its components. The deleted application will be promoted
        manually or automatically based on the deployment strategy of each environment.
      </>
    ),
  });

export const componentDeleteModal = (component: ComponentKind) =>
  createDeleteModalLauncher(component.kind)({
    obj: component,
    model: ComponentModel,
    description: (
      <>
        The component <strong>{component.metadata.name}</strong> will be deleted from the components
        view. The updated application will be promoted manually or automatically based on the
        deployment strategy of each environment.
      </>
    ),
  });
