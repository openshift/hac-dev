import * as React from 'react';
import { Bullseye, ActionList, ActionListItem, Button } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { ImportFormValues } from './utils/types';

type GitImportActionsProps = {
  reviewMode: boolean;
  onBack: () => void;
};

const GitImportActions: React.FunctionComponent<GitImportActionsProps> = ({
  reviewMode,
  onBack,
}) => {
  const { isValid, dirty, isSubmitting, isValidating } = useFormikContext<ImportFormValues>();

  return (
    <Bullseye>
      <ActionList>
        <ActionListItem>
          <Button
            type="submit"
            isDisabled={!isValid || !dirty || isSubmitting || isValidating}
            isLoading={isSubmitting || isValidating}
          >
            {reviewMode ? 'Create application' : 'Import code'}
          </Button>
        </ActionListItem>
        {reviewMode && (
          <>
            <ActionListItem>
              <Button variant="secondary" onClick={onBack}>
                Back
              </Button>
            </ActionListItem>
            <ActionListItem>
              <Button variant="link" type="reset">
                Cancel
              </Button>
            </ActionListItem>
          </>
        )}
      </ActionList>
    </Bullseye>
  );
};

export default GitImportActions;
