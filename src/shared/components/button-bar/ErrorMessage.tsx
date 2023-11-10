import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@patternfly/react-core';

type ErrorMessageProps = { message: React.ReactNode };
const ErrorMessage: React.FC<React.PropsWithChildren<ErrorMessageProps>> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <Alert
      isInline
      className="hacDev-alert hacDev-alert--scrollable"
      variant="danger"
      title={t('An error occurred')}
    >
      <div className="hacDev-pre-line">{message}</div>
    </Alert>
  );
};

export default ErrorMessage;
