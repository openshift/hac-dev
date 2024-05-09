import * as React from 'react';
import {
  ActionList,
  ActionListItem,
  Button,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import type { ImportFormValues } from './type';

import './GitImportActions.scss';

const GitImportActions: React.FunctionComponent = () => {
  const {
    values: { inAppContext, showComponent },
    isValid,
    dirty,
    isSubmitting,
    setFieldValue,
  } = useFormikContext<ImportFormValues>();

  const handleComponent = React.useCallback(() => {
    setFieldValue('showComponent', true);
  }, [setFieldValue]);

  return (
    <PageSection
      className={classNames({ 'git-import-actions__sticky': showComponent })}
      variant={PageSectionVariants.light}
      hasShadowTop={showComponent}
      component="footer"
    >
      <ActionList>
        <ActionListItem>
          <Button
            type="submit"
            isDisabled={!isValid || !dirty || isSubmitting}
            isLoading={isSubmitting}
          >
            {inAppContext ? 'Add component' : 'Create application'}
          </Button>
        </ActionListItem>
        {!showComponent ? (
          <ActionListItem>
            <Button variant="secondary" onClick={handleComponent}>
              Add a component
            </Button>
          </ActionListItem>
        ) : null}
        <ActionListItem>
          <Button variant="link" type="reset">
            Cancel
          </Button>
        </ActionListItem>
      </ActionList>
    </PageSection>
  );
};

export default GitImportActions;
