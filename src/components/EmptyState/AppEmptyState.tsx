import * as React from 'react';
import { EmptyState, EmptyStateIcon, EmptyStateProps, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import './EmptyState.scss';

type AppEmptyStateProps = {
  emptyStateImg: string;
  isXl?: boolean;
  title: React.ReactNode;
} & EmptyStateProps;

const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  emptyStateImg,
  isXl,
  className,
  title,
  children,
  ...props
}) => (
  <EmptyState className={css('app-empty-state m-is-top-level', className)} {...props}>
    <EmptyStateIcon
      icon={() => (
        <img
          className={css('app-empty-state__icon', isXl && 'm-is-xl')}
          src={emptyStateImg}
          alt=""
        />
      )}
    />
    <Title
      className={isXl ? 'pf-u-mt-xl' : 'pf-u-mt-lg'}
      headingLevel="h3"
      size={isXl ? '2xl' : 'lg'}
    >
      {title}
    </Title>
    {children}
  </EmptyState>
);

export default AppEmptyState;
