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
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { css } from '@patternfly/react-styles';
import emptySearchImgUrl from '../../imgs/Not-found.svg';
import { HttpError } from '../../shared/utils/error/http-error';

import './EmptyState.scss';

export const NotFoundEmptyState: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <EmptyState className={css('app-empty-state', className)} variant={EmptyStateVariant.full}>
      <EmptyStateIcon
        className={css('app-empty-state__icon m-is-error')}
        icon={() => <img className="app-empty-state__icon" src={emptySearchImgUrl} alt="" />}
      />
      <Title className="pf-u-mt-lg" headingLevel="h2" size="lg">
        404: Page not found
      </Title>
      <EmptyStateBody>
        {`Looks like that page doesn't exist. Let's get you back to your applications list.`}
      </EmptyStateBody>
      <Button
        variant={ButtonVariant.primary}
        onClick={() => navigate('/application-pipeline/workspaces')}
      >
        Go to applications list
      </Button>
    </EmptyState>
  );
};

type ErrorEmptyStateProps = {
  httpError?: HttpError;
  title?: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<EmptyStateProps, 'children'>;

const ErrorEmptyState: React.FC<ErrorEmptyStateProps> = ({
  title,
  body,
  httpError,
  className,
  children,
  ...props
}) => {
  if (httpError?.code === 404) {
    return <NotFoundEmptyState className={className} {...props} />;
  }
  return (
    <EmptyState
      className={css('app-empty-state', className)}
      variant={EmptyStateVariant.full}
      {...props}
    >
      <EmptyStateIcon
        className={css('app-empty-state__icon m-is-error')}
        icon={ExclamationCircleIcon}
      />
      {title ? (
        <Title className="pf-u-mt-lg" headingLevel="h2" size="lg">
          {title}
        </Title>
      ) : null}
      {body ? <EmptyStateBody>{body}</EmptyStateBody> : null}
      {children}
    </EmptyState>
  );
};

export default ErrorEmptyState;
