import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  SearchInput,
  Title,
  Text,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import { Commit } from '../../types';
import CommitsListHeader from './CommitsListHeader';
import CommitsListRow from './CommitsListRow';

interface CommitsListViewProps {
  commits: Commit[];
  recentOnly?: boolean;
  applicationName?: string;
}

const CommitsListView: React.FC<CommitsListViewProps> = ({
  commits,
  recentOnly = false,
  applicationName,
}) => {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const filteredCommits = React.useMemo(
    () =>
      nameFilter
        ? commits.filter(
            (commit) =>
              commit.sha.indexOf(nameFilter) !== -1 ||
              commit.components.some((c) => c.indexOf(nameFilter) !== -1),
          )
        : commits,
    [nameFilter, commits],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  const emptyMessage = (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No results found
      </Title>
      <EmptyStateBody>
        No results match the filter criteria. Remove filters or clear all filters to show results.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button variant="link" onClick={onClearFilters} data-test="commit-clear-filters">
          Clear all filters
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
        {recentOnly ? 'Recent commits' : 'Commits'}
      </Title>
      <Text className="pf-u-mb-lg">
        Monitor your commits and their pipeline progression across all components.{' '}
        <Button variant="link" className="pf-u-pl-sm">
          Learn more
        </Button>
      </Text>
      {!recentOnly && (
        <Toolbar data-test="commit-list-toolbar" clearAllFilters={onClearFilters}>
          <ToolbarContent>
            <ToolbarGroup alignment={{ default: 'alignLeft' }}>
              <ToolbarItem className="pf-u-ml-0">
                <SearchInput
                  name="nameInput"
                  data-test="name-input-filter"
                  type="search"
                  aria-label="name filter"
                  placeholder="Filter by name..."
                  onChange={(name) => onNameInput(name)}
                  value={nameFilter}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      )}
      {filteredCommits.length > 0 ? (
        <Table
          data={filteredCommits}
          aria-label="Commit List"
          Header={CommitsListHeader}
          Row={CommitsListRow}
          loaded
          getRowProps={(obj) => ({
            id: obj.sha,
          })}
        />
      ) : (
        emptyMessage
      )}
      {recentOnly && applicationName && (
        <Button
          className="pf-u-mt-md"
          variant="secondary"
          onClick={() => navigate(`/stonesoup/applications/${applicationName}/commits`)}
        >
          View More
        </Button>
      )}
    </PageSection>
  );
};

export default CommitsListView;
