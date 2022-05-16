import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popover, PopoverProps } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons';

import './field-level-help.scss';

export const FieldLevelHelp: React.FC<FieldLevelHelpProps> = React.memo(
  ({ children, popoverHasAutoWidth, testId }) => {
    const { t } = useTranslation();
    if (React.Children.count(children) === 0) {
      return null;
    }
    return (
      <Popover
        aria-label={t('public~Help')}
        bodyContent={children}
        hasAutoWidth={popoverHasAutoWidth}
      >
        <Button
          aria-label={t('public~Help')}
          variant="link"
          isInline
          className="hacDev-field-level-help"
          data-test-id={testId || null}
        >
          <OutlinedQuestionCircleIcon className="hacDev-field-level-help__icon" />
        </Button>
      </Popover>
    );
  },
);

type FieldLevelHelpProps = {
  children: React.ReactNode;
  popoverHasAutoWidth?: PopoverProps['hasAutoWidth'];
  testId?: string;
};
