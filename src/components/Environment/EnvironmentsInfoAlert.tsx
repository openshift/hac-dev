import * as React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';

const ENV_ALERT_KEY = 'env-list-instruction';

const EnvironmentsInfoAlert: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [showAlertInfo, setShowAlertInfo] = React.useState<boolean>(
    window.localStorage.getItem(ENV_ALERT_KEY) !== 'false',
  );

  return showAlertInfo ? (
    <Alert
      isInline
      data-testid="env-info-alert"
      className="pf-v5-u-mt-md"
      variant="custom"
      title="Must have available cluster"
      actionClose={
        <AlertActionCloseButton
          onClose={() => {
            setShowAlertInfo(false);
            window.localStorage.setItem(ENV_ALERT_KEY, 'false');
          }}
        />
      }
    >
      Before creating an environment, make sure that you have a cluster available to connect.
      Currently, Red Hat Trusted Application Pipeline only supports creating an environment with
      your own cluster.
    </Alert>
  ) : null;
};

export default EnvironmentsInfoAlert;
