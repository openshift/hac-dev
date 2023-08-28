import * as React from 'react';
import {
  Bullseye,
  ActionList,
  ActionListItem,
  Button,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { ImportFormValues } from './utils/types';

import './GitImportActions.scss';

type GitImportActionsProps = {
  reviewMode: boolean;
  onBack: () => void;
  onCancel: () => void;
  sticky?: boolean;
};

const GitImportActions: React.FunctionComponent<GitImportActionsProps> = ({
  reviewMode,
  onBack,
  onCancel,
  sticky,
}) => {
  const {
    values: { inAppContext },
    isValid,
    dirty,
    isSubmitting,
    setErrors,
    handleSubmit,
  } = useFormikContext<ImportFormValues>();

  const handleBack = () => {
    setErrors({});
    onBack();
  };

  return (
    <PageSection
      className={classNames({ 'git-import-actions__sticky': sticky })}
      variant={PageSectionVariants.light}
      padding={{ default: 'noPadding' }}
      hasShadowTop={sticky}
    >
      <Bullseye>
        <ActionList className="pf-v5-u-pb-lg">
          <ActionListItem>
            <Button
              type="submit"
              onClick={() => handleSubmit()}
              isDisabled={!isValid || !dirty || isSubmitting}
              isLoading={isSubmitting}
            >
              {reviewMode ? (inAppContext ? 'Add component' : 'Create application') : 'Import code'}
            </Button>
          </ActionListItem>
          {reviewMode && (
            <>
              <ActionListItem>
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button variant="link" type="reset" onClick={onCancel}>
                  Cancel
                </Button>
              </ActionListItem>
            </>
          )}
        </ActionList>
      </Bullseye>
    </PageSection>
  );
};

export default GitImportActions;
