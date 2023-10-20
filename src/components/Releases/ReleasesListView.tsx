import * as React from 'react';
import { PageSection, PageSectionVariants, Title, Spinner, Bullseye } from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';
import { useApplicationReleases } from '../../hooks/useApplicationReleases';
import { useSearchParam } from '../../hooks/useSearchParam';
import { useSortedResources } from '../../hooks/useSortedResources';
import { Table } from '../../shared';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { FilterToolbar } from '../Filter/FilterToolbar';
import ReleasesEmptyState from './ReleasesEmptyState';
import getReleasesListHeader, { SortableHeaders } from './ReleasesListHeader';
import ReleasesListRow from './ReleasesListRow';

interface ReleasesListViewProps {
  applicationName: string;
}

enum FilterTypes {
  name = 'name',
  releasePlan = 'release plan',
  releaseSnapshot = 'release snapshot',
}

const sortPaths: Record<SortableHeaders, string> = {
  [SortableHeaders.name]: 'metadata.name',
  [SortableHeaders.created]: 'metadata.creationTimestamp',
};

const ReleasesListView: React.FC<ReleasesListViewProps> = ({ applicationName }) => {
  const [releases, loaded] = useApplicationReleases(applicationName);
  const [filterType, setFilterType] = React.useState<FilterTypes>(FilterTypes.name);
  const [searchFilter, setSearchFilter, clearSearchFilter] = useSearchParam(filterType, '');
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>(SortableHeaders.created);
  const [activeSortDirection, setActiveSortDirection] = React.useState<SortByDirection>(
    SortByDirection.desc,
  );

  const ReleasesListHeader = React.useMemo(
    () =>
      getReleasesListHeader(activeSortIndex, activeSortDirection, (_, index, direction) => {
        setActiveSortIndex(index);
        setActiveSortDirection(direction);
      }),
    [activeSortDirection, activeSortIndex],
  );

  const filteredReleases = React.useMemo(() => {
    switch (filterType) {
      case FilterTypes.name:
        return releases.filter((r) => r.metadata.name.indexOf(searchFilter) !== -1);
      case FilterTypes.releasePlan:
        return releases.filter((r) => r.spec.releasePlan.indexOf(searchFilter) !== -1);
      case FilterTypes.releaseSnapshot:
        return releases.filter((r) => r.spec.snapshot.indexOf(searchFilter) !== -1);
      default:
        return releases;
    }
  }, [filterType, releases, searchFilter]);

  const sortedReleases = useSortedResources(
    filteredReleases,
    activeSortIndex,
    activeSortDirection,
    sortPaths,
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!releases?.length) {
    return <ReleasesEmptyState />;
  }

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Title size="lg" headingLevel="h3" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-sm">
        Releases
      </Title>
      <>
        <FilterToolbar
          value={searchFilter}
          dropdownItems={Object.values(FilterTypes)}
          onInput={setSearchFilter}
          onFilterTypeChange={(val) => {
            clearSearchFilter();
            setFilterType(val as FilterTypes);
          }}
        />
        {!sortedReleases?.length ? (
          <FilteredEmptyState onClearFilters={clearSearchFilter} />
        ) : (
          <>
            <Table
              data-test="releases__table"
              data={sortedReleases}
              aria-label="Release List"
              Header={ReleasesListHeader}
              Row={ReleasesListRow}
              loaded
              getRowProps={(obj) => ({
                id: obj.sha,
              })}
              customData={{ applicationName }}
            />
          </>
        )}
      </>
    </PageSection>
  );
};

export default ReleasesListView;
