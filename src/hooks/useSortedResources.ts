import * as React from 'react';
import { SortByDirection } from '@patternfly/react-table';
import sortBy from 'lodash/sortBy';

type SortByPaths = Record<number, string>;

/**
 * Sort list of resources based on sort index and direction.
 * Meant to be used with sortable list views.
 *
 * @param resources List of resources
 * @param sortIndex Index of column to sort by
 * @param sortDirection Ascending or descending
 * @param sortPaths key/value pairs of sort index & sort path
 * example path for sorting by metadata.name: `'metadata.name'`
 */
export const useSortedResources = <R extends unknown>(
  resources: R[],
  sortIndex: number,
  sortDirection: SortByDirection,
  sortPaths: SortByPaths,
): R[] =>
  React.useMemo(() => {
    const sorted = sortBy<R>(resources, sortPaths[sortIndex]);
    return sortDirection === SortByDirection.asc ? sorted : sorted.reverse();
  }, [resources, sortDirection, sortIndex, sortPaths]);
