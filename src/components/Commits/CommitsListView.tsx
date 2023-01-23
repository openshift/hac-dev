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
  Select,
  SelectVariant,
  SelectGroup,
  SelectOption,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useSearchParam } from '../../hooks/useSearchParam';
import { pipelineRunFilterReducer, Table } from '../../shared';
import { Commit } from '../../types';
import { statuses } from '../../utils/commits-utils';
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
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const statusFilterObj = React.useMemo(() => {
    return commits.reduce((acc, c) => {
      const stat = pipelineRunFilterReducer(c.pipelineRuns[0]);
      if (statuses.includes(stat)) {
        if (acc[stat] !== undefined) {
          acc[stat] = acc[stat] + 1;
        } else {
          acc[stat] = 1;
        }
      }
      return acc;
    }, {});
  }, [commits]);

  const filteredCommits = React.useMemo(
    () =>
      commits.filter(
        (commit) =>
          (!nameFilter ||
            commit.sha.indexOf(nameFilter) !== -1 ||
            commit.components.some(
              (c) => c.toLowerCase().indexOf(nameFilter.trim().toLowerCase()) !== -1,
            ) ||
            commit.pullRequestNumber
              .toLowerCase()
              .indexOf(nameFilter.trim().replace('#', '').toLowerCase()) !== -1 ||
            commit.shaTitle.toLowerCase().includes(nameFilter.trim().toLowerCase())) &&
          (!statusFilters.length ||
            statusFilters.includes(pipelineRunFilterReducer(commit.pipelineRuns[0]))),
      ),
    [nameFilter, commits, statusFilters],
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
      {recentOnly ? (
        <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
          {recentOnly ? 'Recent commits' : 'Commits'}
        </Title>
      ) : null}
      <Text className="pf-u-mb-lg">Events progression triggered by the commit.</Text>
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
              <ToolbarItem>
                <Select
                  placeholderText="Status"
                  toggleIcon={<FilterIcon />}
                  toggleAriaLabel="Status filter menu"
                  variant={SelectVariant.checkbox}
                  isOpen={statusFilterExpanded}
                  onToggle={setStatusFilterExpanded}
                  onSelect={(event, selection) => {
                    const checked = (event.target as HTMLInputElement).checked;
                    setStatusFilters(
                      checked
                        ? [...statusFilters, String(selection)]
                        : statusFilters.filter((value) => value !== selection),
                    );
                  }}
                  selections={statusFilters}
                  isGrouped
                >
                  {[
                    <SelectGroup label="Status" key="status">
                      {Object.keys(statusFilterObj).map((filter) => (
                        <SelectOption
                          key={filter}
                          value={filter}
                          isChecked={statusFilters.includes(filter)}
                          itemCount={statusFilterObj[filter] ?? 0}
                        >
                          {filter}
                        </SelectOption>
                      ))}
                    </SelectGroup>,
                  ]}
                </Select>
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
          onClick={() => navigate(`/stonesoup/applications/${applicationName}/activity`)}
        >
          View More
        </Button>
      )}
    </PageSection>
  );
};

export default CommitsListView;
