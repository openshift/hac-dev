import * as React from 'react';
import { Alert, ExpandableSection } from '@patternfly/react-core';
import { Timestamp } from '../..//shared/components/timestamp/Timestamp';
import { ErrorStatus } from './utils/snapshot-utils';

interface EnvironmentProvisionErrorAlertProps {
  errorStatus: ErrorStatus[];
}

const EnvironmentProvisionErrorAlert: React.FC<EnvironmentProvisionErrorAlertProps> = ({
  errorStatus,
}) => {
  const title = (
    <>
      Failed for{' '}
      {errorStatus.map((s, i) => {
        return (
          <b key={s.scenario}>
            {i !== 0 && ', '}
            {s.scenario}
          </b>
        );
      })}
    </>
  );

  return (
    <Alert
      data-test="env-provision-err-alert"
      isInline
      isPlain
      className="pf-v5-u-mt-md"
      variant="danger"
      title={title}
    >
      Snapshot failed to deploy at{' '}
      <Timestamp
        className="pf-v5-u-display-inline"
        timestamp={errorStatus[0].lastUpdateTime}
        data-test="alert-timestamp"
      />
      <ExpandableSection toggleText="Show details">
        {errorStatus.map((s, i) => (
          <span key={s.scenario}>
            {i > 0 && ', '}
            {s.details}
          </span>
        ))}
      </ExpandableSection>
    </Alert>
  );
};

export default EnvironmentProvisionErrorAlert;
