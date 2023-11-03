import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateVariant,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import { css } from '@patternfly/react-styles';
import { HttpError } from '../../shared/utils/error/http-error';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';

import '../../shared/components/empty-state/EmptyState.scss';

type NoAccessStateProps = {
  httpError?: HttpError;
  title?: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<EmptyStateProps, 'children'>;

const NoAccessState: React.FC<NoAccessStateProps> = ({
  title,
  body,
  className,
  children,
  ...props
}) => {
  const navigate = useNavigate();
  const { workspace } = useWorkspaceInfo();
  return (
    <EmptyState
      className={css('app-empty-state', className)}
      variant={EmptyStateVariant.full}
      {...props}
      data-test="no-access-state"
    >
      <EmptyStateHeader
        titleText={<>{title || `Let's get you access`}</>}
        icon={<EmptyStateIcon className={css('app-empty-state__icon ')} icon={LockIcon} />}
        headingLevel="h2"
      />
      <EmptyStateBody>
        {body ||
          `Ask the administrator or the owner of the ${workspace} workspace for access permissions.`}
      </EmptyStateBody>
      <EmptyStateFooter>
        {children || (
          <Button
            variant={ButtonVariant.primary}
            data-test="no-access-action"
            onClick={() => navigate('/application-pipeline')}
          >
            Go to Overview page
          </Button>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NoAccessState;
