import * as React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';

const SAMPLES_FLOW_INSTRUCTION_KEY = 'samples-flow-instruction';

const SamplesInfoAlert: React.FC = ({ children }) => {
  const [showAlertInfo, setShowAlertInfo] = React.useState<boolean>(
    window.localStorage.getItem(SAMPLES_FLOW_INSTRUCTION_KEY) !== 'false',
  );

  return showAlertInfo ? (
    <Alert
      isInline
      data-testid="samples-info-alert"
      className="pf-u-mt-md"
      variant="default"
      title="Fork the sample to your own repository"
      actionClose={
        <AlertActionCloseButton
          onClose={() => {
            setShowAlertInfo(false);
            window.localStorage.setItem(SAMPLES_FLOW_INSTRUCTION_KEY, 'false');
          }}
        />
      }
    >
      {children}
    </Alert>
  ) : null;
};

export default SamplesInfoAlert;
