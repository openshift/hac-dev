import React from 'react';
import { Alert } from '@patternfly/react-core';

type InfoMessageProps = { message: React.ReactNode };

const InfoMessage: React.FC<React.PropsWithChildren<InfoMessageProps>> = ({ message }) => (
  <Alert isInline className="hacDev-alert" variant="info" title={message} />
);

export default InfoMessage;
