import * as React from 'react';
import { Alert } from '@patternfly/react-core';
import { Timestamp } from '../..//shared/components/timestamp/Timestamp';

interface EnvironmentProvisionErrorAlertProps {
  errMsg: string;
  timeStamp?: string;
  scenario?: string;
}

const EnvironmentProvisionErrorAlert: React.FC<EnvironmentProvisionErrorAlertProps> = ({
  errMsg,
  timeStamp,
  scenario,
}) => {
  return (
    <Alert
      isInline
      data-testid="env-info-alert"
      className="pf-v5-u-mt-md"
      variant="danger"
      title={errMsg}
    >
      {scenario && (
        <>
          {' '}
          for scenario <b data-test="alert-scenario-name">{scenario}</b>
        </>
      )}
      {timeStamp && (
        <>
          {' '}
          at{' '}
          <Timestamp
            className="pf-v5-u-display-inline"
            timestamp={timeStamp}
            data-test="alert-timestamp"
          />
        </>
      )}
    </Alert>
  );
};

export default EnvironmentProvisionErrorAlert;
