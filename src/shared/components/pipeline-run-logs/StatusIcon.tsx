import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/js/icons';
import { css } from '@patternfly/react-styles';
import pipelineStyles from '@patternfly/react-styles/css/components/Topology/topology-pipelines';
import {
  getRunStatusModifier,
  RunStatus,
  StatusIcon as PfStatusIcon,
} from '@patternfly/react-topology';
import { getLabelColorFromStatus, runStatus } from './utils';

import './StatusIcon.scss';

type StatusIconProps = {
  status: string;
  height?: number;
  width?: number;
  disableSpin?: boolean;
};

export const StatusIcon: React.FC<StatusIconProps> = ({ status, ...props }) => {
  if (status === runStatus.Cancelling) {
    // Interim state required to avoid any other actions on pipelinerun that is currently being cancelled.
    return (
      <span
        className={css(
          pipelineStyles.topologyPipelinesStatusIcon,
          getRunStatusModifier(RunStatus.Cancelled),
        )}
      >
        <ExclamationTriangleIcon {...props} />
      </span>
    );
  }
  return <PfStatusIcon status={status as RunStatus} {...props} />;
};

export const ColoredStatusIcon: React.FC<StatusIconProps> = ({ status, ...others }) => {
  return (
    <div
      className={css(
        'status-icon',
        pipelineStyles.topologyPipelinesStatusIcon,
        (status === RunStatus.Running || status === RunStatus.InProgress) && 'pf-m-spin',
        getRunStatusModifier(status as RunStatus),
      )}
    >
      <StatusIcon status={status} {...others} />
    </div>
  );
};

export const StatusIconWithText: React.FC<
  StatusIconProps & { text?: string; dataTestAttribute?: string }
> = ({ status, text, dataTestAttribute, ...others }) => {
  return (
    <>
      <span
        className={css(
          'pf-u-mr-xs status-icon',
          pipelineStyles.topologyPipelinesPillStatus,
          (status === RunStatus.Running || status === RunStatus.InProgress) && 'pf-m-spin',
          getRunStatusModifier(status as RunStatus),
        )}
      >
        <StatusIcon status={status} {...others} />
      </span>
      <span data-test={dataTestAttribute}>{text ?? status}</span>
    </>
  );
};

export const StatusIconWithTextLabel: React.FC<
  StatusIconProps & { text?: string; dataTestAttribute?: string }
> = ({ status, ...others }) => {
  return (
    <Label color={getLabelColorFromStatus(status)}>
      <StatusIconWithText status={status} {...others} />
    </Label>
  );
};
