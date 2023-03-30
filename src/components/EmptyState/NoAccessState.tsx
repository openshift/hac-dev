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
  Title,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import { css } from '@patternfly/react-styles';
import { HttpError } from '../../shared/utils/error/http-error';

import './EmptyState.scss';

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
  return (
    <EmptyState
      className={css('app-empty-state', className)}
      variant={EmptyStateVariant.full}
      {...props}
      data-test="no-access-state"
    >
      <EmptyStateIcon className={css('app-empty-state__icon ')} icon={LockIcon} />
      <Title className="pf-u-mt-lg" headingLevel="h2" size="lg">
        {title || 'Access permission Denied'}
      </Title>
      <EmptyStateBody>
        {body ||
          `You don't have access to this page, ask your administrator to adjust your permissions.`}
      </EmptyStateBody>
      {children || (
        <Button variant={ButtonVariant.primary} onClick={() => navigate('/stonesoup/workspaces')}>
          Go to applications list
        </Button>
      )}
    </EmptyState>
  );
};

export default NoAccessState;
