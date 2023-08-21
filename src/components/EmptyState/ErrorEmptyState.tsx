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
  EmptyStateHeader,
  EmptyStateFooter,
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
      <EmptyStateHeader
        titleText="404: Page not found"
        icon={
          <EmptyStateIcon
            className={css('app-empty-state__icon m-is-error')}
            icon={() => <img className="app-empty-state__icon" src={emptySearchImgUrl} alt="" />}
          />
        }
        headingLevel="h2"
      />
      <EmptyStateBody>
        {`Looks like that page doesn't exist. Let's get you back to your applications list.`}
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button
          variant={ButtonVariant.primary}
          onClick={() => navigate('/application-pipeline/workspaces')}
        >
          Go to applications list
        </Button>
      </EmptyStateFooter>
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
      <EmptyStateHeader
        icon={
          <EmptyStateIcon
            className={css('app-empty-state__icon m-is-error')}
            icon={ExclamationCircleIcon}
          />
        }
      />
      <EmptyStateFooter>
        {title ? (
          <Title className="pf-v5-u-mt-lg" headingLevel="h2" size="lg">
            {title}
          </Title>
        ) : null}
        {body ? <EmptyStateBody>{body}</EmptyStateBody> : null}
        {children}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default ErrorEmptyState;
