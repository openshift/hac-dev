import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import emptySearchImgUrl from '../../../imgs/Not-found.svg';

import './EmptyState.scss';

const EmptyStateImg = () => (
  <img className="app-empty-state__icon" src={emptySearchImgUrl} alt="" />
);

const FilteredEmptyState: React.FC<
  React.PropsWithChildren<Omit<EmptyStateProps, 'children'> & { onClearFilters: () => void }>
> = ({ onClearFilters, ...props }) => (
  <EmptyState className="app-empty-state" variant={EmptyStateVariant.full} {...props}>
    <EmptyStateHeader
      titleText="No results found"
      icon={<EmptyStateIcon icon={EmptyStateImg} />}
      headingLevel="h2"
    />
    <EmptyStateBody>
      No results match this filter criteria. Clear all filters and try again.
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        <Button variant="link" onClick={onClearFilters} data-test="commit-clear-filters">
          Clear all filters
        </Button>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

export default FilteredEmptyState;
