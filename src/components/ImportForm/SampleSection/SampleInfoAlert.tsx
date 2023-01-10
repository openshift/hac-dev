import * as React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';

const SamplesInfoAlert: React.FC = ({ children }) => {
  const [showAlertInfo, setShowAlertInfo] = React.useState<boolean>(true);

  return showAlertInfo ? (
    <Alert
      isInline
      data-testid="samples-info-alert"
      className="pf-u-mt-md"
      variant="default"
      title="Try out a sample"
      actionClose={<AlertActionCloseButton onClose={() => setShowAlertInfo(false)} />}
    >
      {children}
    </Alert>
  ) : null;
};

export default SamplesInfoAlert;
