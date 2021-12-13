import React from 'react';
import { Alert } from '@patternfly/react-core';

type SuccessMessageProps = { message: React.ReactNode };

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
  <Alert isInline className="hacDev-alert" variant="success" title={message} />
);

export default SuccessMessage;
