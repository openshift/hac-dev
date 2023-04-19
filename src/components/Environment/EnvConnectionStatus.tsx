import * as React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { CheckIcon } from '@patternfly/react-icons/dist/js/icons/check-icon';
import { EnvironmentKind } from '../../types';
import { useEnvConnectionStatus } from './environment-utils';

type EnvConnStatusProps = {
  environment: EnvironmentKind;
};

export const EnvConnectionStatus: React.FC<EnvConnStatusProps> = ({ environment }) => {
  const envStatus = useEnvConnectionStatus(environment);

  if (!envStatus) {
    return null;
  }

  const label = (
    <Label
      className="pf-u-font-weight-normal"
      color={envStatus.status === 'True' ? 'green' : 'red'}
      icon={envStatus.status === 'True' ? <CheckIcon /> : <ExclamationCircleIcon />}
    >
      {envStatus.status === 'True' ? 'Connection successful' : 'Connection error'}
    </Label>
  );
  return envStatus.message ? <Tooltip content={envStatus.message}>{label}</Tooltip> : label;
};
