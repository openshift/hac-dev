import * as React from 'react';
import {
  PageSection,
  PageSectionVariants,
  Title,
  Spinner,
  Bullseye,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  InputGroup,
  Button,
  TextInput,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons';
import { useApplicationReleases } from '../../hooks';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import ReleasesEmptyState from './ReleasesEmptyState';
import ReleasesListHeader from './ReleasesListHeader';
import ReleasesListRow from './ReleasesListRow';

interface ReleasesListViewProps {
  applicationName: string;
}

const ReleasesListView: React.FC<ReleasesListViewProps> = ({ applicationName }) => {
  const [releases, loaded] = useApplicationReleases(applicationName);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const onClearFilters = () => setNameFilter('');

  const filteredReleases = React.useMemo(
    () => releases.filter((r) => r.metadata.name.indexOf(nameFilter) !== -1),
    [releases, nameFilter],
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
      <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
        Releases
      </Title>
      <>
        <Toolbar data-testid="release-list-toolbar" clearAllFilters={onClearFilters}>
          <ToolbarContent>
            <ToolbarGroup alignment={{ default: 'alignLeft' }}>
              <ToolbarItem>
                <InputGroup>
                  <Button variant="control">
                    <FilterIcon /> Name
                  </Button>
                  <TextInput
                    name="nameInput"
                    data-test="name-input-filter"
                    type="search"
                    aria-label="name filter"
                    placeholder="Filter by name..."
                    onChange={setNameFilter}
                    value={nameFilter}
                  />
                </InputGroup>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
        {!filteredReleases?.length ? (
          <FilteredEmptyState onClearFilters={onClearFilters} />
        ) : (
          <>
            <Table
              data-test="releases__table"
              data={filteredReleases}
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
