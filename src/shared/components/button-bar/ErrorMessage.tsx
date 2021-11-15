import React from 'react';
import { Alert } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';

type ErrorMessageProps = { message: React.ReactNode };
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <Alert
      isInline
      className="hacDev-alert hacDev-alert--scrollable"
      variant="danger"
      title={t('hac-shared~An error occurred')}
    >
      <div className="hacDev-pre-line">{message}</div>
    </Alert>
  );
};

export default ErrorMessage;
