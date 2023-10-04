import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { SpaceBindingRequest } from '../../types';

export const SBRStatusLabel: React.FC<{ sbr: SpaceBindingRequest }> = ({ sbr }) => {
  const status = sbr.status?.conditions?.[0];

  if (!status) {
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
