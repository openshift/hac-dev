import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Label, Tooltip } from '@patternfly/react-core';
import { SpaceBindingRequestGroupVersionKind } from '../../models';
import { SpaceBindingRequest, WorkspaceBinding } from '../../types';

export const SBRStatusLabel: React.FC<{ sbr: WorkspaceBinding['bindingRequest'] }> = ({ sbr }) => {
  const [binding, loaded] = useK8sWatchResource<SpaceBindingRequest>(
    sbr
      ? {
          groupVersionKind: SpaceBindingRequestGroupVersionKind,
          name: sbr.name,
          namespace: sbr.namespace,
        }
      : null,
  );
  const status = binding?.status?.conditions?.[0];

  if (!loaded || !status) {
    return <>-</>;
  }

  if (status.reason === 'Provisioned') {
    return <Label color="green">{status.reason}</Label>;
  }

  return (
    <Tooltip content={status.message}>
      <Label color="gold">{status.reason}</Label>
    </Tooltip>
  );
};
