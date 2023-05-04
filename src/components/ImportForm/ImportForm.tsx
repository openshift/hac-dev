import React from 'react';
import { Bullseye, PageSection, Spinner } from '@patternfly/react-core';
import GitImportForm from './GitImportForm';
import SampleImportForm from './SampleImportForm';
import { useValidApplicationName } from './utils/useValidApplicationName';

import './ImportForm.scss';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const [reviewMode, setReviewMode] = React.useState(false);
  const [validAppName, appNameloaded] = useValidApplicationName();

  if (!appNameloaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <PageSection isFilled className="import-form">
      <GitImportForm
        applicationName={applicationName}
        recommendedApplicationName={validAppName}
        reviewMode={reviewMode}
        setReviewMode={setReviewMode}
      />
      <br />
      {!reviewMode && (
        <SampleImportForm
          applicationName={applicationName}
          recommendedApplicationName={validAppName}
        />
      )}
    </PageSection>
  );
};

export default ImportForm;
