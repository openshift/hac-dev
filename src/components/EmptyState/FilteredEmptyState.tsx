import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import emptySearchImgUrl from '../../imgs/Not-found.svg';

import './EmptyState.scss';

const EmptyStateImg = () => (
  <img className="app-empty-state__icon" src={emptySearchImgUrl} alt="" />
);

const FilteredEmptyState: React.FC<
  Omit<EmptyStateProps, 'children'> & { onClearFilters: () => void }
> = ({ onClearFilters, ...props }) => (
  <EmptyState className="app-empty-state" variant={EmptyStateVariant.full} {...props}>
    <EmptyStateIcon icon={EmptyStateImg} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No results match this filter criteria. Clear all filters and try again.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link" onClick={onClearFilters} data-test="commit-clear-filters">
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

export default FilteredEmptyState;
