import * as React from 'react';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { ImportFormValues } from './utils/types';

const GitImportErrors = () => {
  const { status, setStatus } = useFormikContext<ImportFormValues>();

  if (!status?.submitError) return null;

  return (
    <Alert
      isInline
      variant="danger"
      title="An error occurred"
      actionClose={
        <AlertActionCloseButton onClose={() => setStatus({ ...status, submitError: '' })} />
      }
    >
      {status?.submitError}
    </Alert>
  );
};

export default GitImportErrors;
