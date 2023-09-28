import * as React from 'react';
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Select,
  SelectVariant,
  SelectGroup,
  SelectOption,
} from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { useBuildPipelines } from '../../hooks/useBuildPipelines';
import { useComponents } from '../../hooks/useComponents';
import { useSearchParam } from '../../hooks/useSearchParam';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import Table from '../../shared/components/table/Table';
import { getCommitsFromPLRs, statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import CommitsEmptyState from './CommitsEmptyState';
import CommitsListHeader from './CommitsListHeader';
import CommitsListRow from './CommitsListRow';

interface CommitsListViewProps {
  applicationName?: string;
  componentName?: string;
}

const CommitsListView: React.FC<CommitsListViewProps> = ({ applicationName, componentName }) => {
  const { namespace } = useWorkspaceInfo();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const [components, componentsLoaded] = useComponents(
    componentName ? null : namespace,
    applicationName,
  );

  const [pipelineRuns, loaded, , getNextPage] = useBuildPipelines(
    namespace,
    applicationName,
    undefined,
    true,
    componentName ? [componentName] : componentsLoaded && components?.map((c) => c.metadata.name),
  );

  const commits = React.useMemo(
    () => (loaded && pipelineRuns && getCommitsFromPLRs(pipelineRuns)) || [],
    [loaded, pipelineRuns],
  );

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
      const stat = pipelineRunStatus(c.pipelineRuns[0]);
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
            statusFilters.includes(pipelineRunStatus(commit.pipelineRuns[0]))),
      ),
    [commits, nameFilter, statusFilters],
  );

  const onClearFilters = () => {
    setNameFilter('');
    setStatusFilters([]);
  };
  const onNameInput = (name: string) => setNameFilter(name);

  const NoDataEmptyMessage = () => <CommitsEmptyState applicationName={applicationName} />;
  const EmptyMessage = () => <FilteredEmptyState onClearFilters={onClearFilters} />;

  const DataToolbar = (
    <Toolbar data-test="commit-list-toolbar" clearAllFilters={onClearFilters}>
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignLeft' }}>
          <ToolbarItem className="pf-v5-u-ml-0">
            <SearchInput
              name="nameInput"
              data-test="name-input-filter"
              type="search"
              aria-label="name filter"
              placeholder="Filter by name..."
              onChange={(e, name) => onNameInput(name)}
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
              onToggle={(_event, expanded) => setStatusFilterExpanded(expanded)}
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
  );

  return (
    <Table
      virtualize
      data={filteredCommits}
      unfilteredData={commits}
      EmptyMsg={EmptyMessage}
      NoDataEmptyMsg={NoDataEmptyMessage}
      Toolbar={DataToolbar}
      aria-label="Commit List"
      Header={CommitsListHeader}
      Row={CommitsListRow}
      loaded={loaded && componentsLoaded}
      getRowProps={(obj) => ({
        id: obj.sha,
      })}
      onRowsRendered={({ stopIndex }) => {
        if (loaded && stopIndex === filteredCommits.length - 1) {
          getNextPage?.();
        }
      }}
    />
  );
};

export default CommitsListView;
