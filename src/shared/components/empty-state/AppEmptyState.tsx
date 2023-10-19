import * as React from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import './EmptyState.scss';

type AppEmptyStateProps = {
  emptyStateImg: string;
  isXl?: boolean;
  title: React.ReactNode;
} & EmptyStateProps;

const AppEmptyState: React.FC<React.PropsWithChildren<AppEmptyStateProps>> = ({
  emptyStateImg,
  isXl,
  className,
  title,
  children,
  ...props
}) => (
  <EmptyState className={css('app-empty-state m-is-top-level', className)} {...props}>
    <EmptyStateHeader
      titleText={<>{title}</>}
      icon={
        <EmptyStateIcon
          icon={() => (
            <img
              className={css('app-empty-state__icon', isXl && 'm-is-xl')}
              src={emptyStateImg}
              alt=""
            />
          )}
        />
      }
      headingLevel="h3"
    />
    <EmptyStateFooter>{children}</EmptyStateFooter>
  </EmptyState>
);

export default AppEmptyState;
