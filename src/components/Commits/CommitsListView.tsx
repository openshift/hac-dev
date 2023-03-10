import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Button,
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
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useSearchParam } from '../../hooks/useSearchParam';
import { PipelineRunGroupVersionKind } from '../../models';
import { Table } from '../../shared';
import { PipelineRunKind } from '../../types';
import { getCommitsFromPLRs, statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import CommitsEmptyState from './CommitsEmptyState';
import CommitsListHeader from './CommitsListHeader';
import CommitsListRow from './CommitsListRow';

const RECENT_COMMIT_LIMIT = 5;

interface CommitsListViewProps {
  recentOnly?: boolean;
  applicationName?: string;
}

const CommitsListView: React.FC<CommitsListViewProps> = ({
  recentOnly = false,
  applicationName,
}) => {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');

  const { namespace, workspace } = useWorkspaceInfo();

  const [pipelineRuns, loaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
      },
    },
  });

  const commits = React.useMemo(
    () =>
      (loaded &&
        pipelineRuns &&
        getCommitsFromPLRs(pipelineRuns, recentOnly ? RECENT_COMMIT_LIMIT : undefined)) ||
      [],
    [loaded, pipelineRuns, recentOnly],
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
    [nameFilter, commits, statusFilters],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      {recentOnly ? (
        <>
          <Title size="lg" headingLevel="h3" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
            Recent commits
          </Title>
        </>
      ) : null}
      {!loaded ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <>
          {!commits || commits.length === 0 ? (
            <CommitsEmptyState applicationName={applicationName} />
          ) : (
            <>
              <Text className="pf-u-mb-lg">
                Monitor your commits and their pipeline progression across all components.
              </Text>
              {!recentOnly ? (
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
                          onChange={(e, name) => onNameInput(name)}
                          value={nameFilter}
                          onClear={onClearFilters}
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
              ) : null}
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
                <FilteredEmptyState onClearFilters={onClearFilters} />
              )}
              {recentOnly && applicationName && (
                <Button
                  className="pf-u-mt-md"
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/stonesoup/workspaces/${workspace}/applications/${applicationName}/activity/latest-commits`,
                    )
                  }
                >
                  View More
                </Button>
              )}
            </>
          )}
        </>
      )}
    </PageSection>
  );
};

export default CommitsListView;
