import * as React from 'react';
import { Alert } from '@patternfly/react-core';
import { Timestamp } from '../..//shared/components/timestamp/Timestamp';

interface EnvironmentProvisionErrorAlertProps {
  errMsg: string;
  timeStamp?: string;
}

const EnvironmentProvisionErrorAlert: React.FC<EnvironmentProvisionErrorAlertProps> = ({
  errMsg,
  timeStamp,
}) => {
  return (
    <Alert
      isInline
      data-testid="env-info-alert"
      className="pf-v5-u-mt-md"
      variant="danger"
      title={errMsg}
    >
      {timeStamp && (
        <>
          at <Timestamp timestamp={timeStamp} />
        </>
      )}
    </Alert>
  );
};

export default EnvironmentProvisionErrorAlert;
