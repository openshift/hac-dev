import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import {
  Select,
  SelectVariant,
  SelectGroup,
  SelectOption,
} from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { PipelineRunLabel, PipelineRunType } from '../../consts/pipelinerun';
import { useComponents } from '../../hooks/useComponents';
import { usePipelineRuns } from '../../hooks/usePipelineRuns';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { getCommitsFromPLRs, statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import CommitsEmptyState from './CommitsEmptyState';
import CommitsListHeader from './CommitsListHeader';
import CommitsListRow from './CommitsListRow';

const RECENT_COMMIT_LIMIT = 5;

interface CommitsListViewProps {
  recentOnly?: boolean;
  applicationName?: string;
  componentName?: string;
}

const CommitsListView: React.FC<CommitsListViewProps> = ({
  recentOnly = false,
  applicationName,
  componentName,
}) => {
  const navigate = useNavigate();
  const { namespace, workspace } = useWorkspaceInfo();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const [components, componentsLoaded] = useComponents(namespace, applicationName);

  const [pipelineRuns, loaded] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
            [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
          },
          matchExpressions: [
            {
              key: `${PipelineRunLabel.COMPONENT}`,
              operator: 'In',
              values: componentName ? [componentName] : components?.map((c) => c.metadata?.name),
            },
          ],
        },
        limit: recentOnly ? RECENT_COMMIT_LIMIT : undefined,
      }),
      [applicationName, componentName, components, recentOnly],
    ),
  );

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
    [commits, nameFilter, statusFilters],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      {recentOnly ? (
        <>
          <Title size="lg" headingLevel="h3" className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-sm">
            Latest commits
          </Title>
        </>
      ) : null}
      {!loaded || !componentsLoaded ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <>
          {!commits || commits.length === 0 ? (
            <CommitsEmptyState applicationName={applicationName} />
          ) : (
            <>
              <Text className="pf-v5-u-mb-lg">
                Monitor your commits and their pipeline progression across all components.
              </Text>
              {!recentOnly ? (
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
                  className="pf-v5-u-mt-md"
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/application-pipeline/workspaces/${workspace}/applications/${applicationName}/activity/latest-commits`,
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
