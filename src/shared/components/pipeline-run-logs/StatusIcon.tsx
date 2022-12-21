import * as React from 'react';
import { Label } from '@patternfly/react-core';
import {
  AngleDoubleRightIcon,
  BanIcon,
  CheckCircleIcon,
  CircleIcon,
  ExclamationCircleIcon,
  HourglassHalfIcon,
  SyncAltIcon,
} from '@patternfly/react-icons/dist/js/icons';
import cx from 'classnames';
import { getRunStatusColor, runStatus } from './utils';

type StatusIconProps = {
  status: string;
  height?: number;
  width?: number;
  disableSpin?: boolean;
};

export const StatusIcon: React.FC<StatusIconProps> = ({ status, disableSpin, ...props }) => {
  switch (status) {
    case runStatus['In Progress']:
    case runStatus.Running:
      return <SyncAltIcon {...props} className={cx({ 'fa-spin': !disableSpin })} />;

    case runStatus.Succeeded:
      return <CheckCircleIcon {...props} />;

    case runStatus.Failed:
      return <ExclamationCircleIcon {...props} />;

    case runStatus.Idle:
    case runStatus.Pending:
      return <HourglassHalfIcon {...props} />;

    case runStatus.Cancelling:
    case runStatus.Cancelled:
      return <BanIcon {...props} />;

    case runStatus.Skipped:
      return <AngleDoubleRightIcon {...props} />;

    default:
      return <CircleIcon {...props} />;
  }
};

export const ColoredStatusIcon: React.FC<StatusIconProps> = ({ status, ...others }) => {
  return (
    <div
      style={{
        color: status
          ? getRunStatusColor(status).pftoken.value
          : getRunStatusColor(runStatus.Cancelled).pftoken.value,
      }}
    >
      <StatusIcon status={status} {...others} />
    </div>
  );
};

export const StatusIconWithText: React.FC<
  StatusIconProps & { text?: string; dataTestAttribute?: string }
> = ({ status, text, dataTestAttribute, ...others }) => {
  return (
    <Label>
      <span
        className="pf-u-mr-xs"
        style={{
          color: status
            ? getRunStatusColor(status).labelColor
            : getRunStatusColor(runStatus.Cancelled).pftoken.value,
        }}
      >
        <StatusIcon status={status} {...others} />
      </span>{' '}
      <span data-test={dataTestAttribute}>{text ?? status}</span>
    </Label>
  );
};
