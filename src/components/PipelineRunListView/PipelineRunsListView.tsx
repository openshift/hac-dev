import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  SearchInput,
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useSearchParam } from '../../hooks/useSearchParam';
import { PipelineRunGroupVersionKind } from '../../models';
import { pipelineRunFilterReducer, Table } from '../../shared';
import { PipelineRunKind } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import PipelineRunEmptyState from '../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeader } from './PipelineRunListHeader';
import PipelineRunListRow from './PipelineRunListRow';

type PipelineRunsListViewProps = { applicationName: string };
const PipelineRunsListView: React.FC<PipelineRunsListViewProps> = ({ applicationName }) => {
  const { namespace } = useWorkspaceInfo();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');

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

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const statusFilterObj = React.useMemo(() => {
    return pipelineRuns.reduce((acc, plr) => {
      const stat = pipelineRunFilterReducer(plr);
      if (statuses.includes(stat)) {
        if (acc[stat] !== undefined) {
          acc[stat] = acc[stat] + 1;
        } else {
          acc[stat] = 1;
        }
      }
      return acc;
    }, {});
  }, [pipelineRuns]);

  const filteredPLRs = React.useMemo(
    () =>
      pipelineRuns.filter(
        (plr) =>
          (!nameFilter ||
            plr.metadata.name.indexOf(nameFilter) !== -1 ||
            plr.metadata.labels[PipelineRunLabel.COMPONENT]?.indexOf(
              nameFilter.trim().toLowerCase(),
            ) !== -1) &&
          (!statusFilters.length || statusFilters.includes(pipelineRunFilterReducer(plr))),
      ),
    [nameFilter, pipelineRuns, statusFilters],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!pipelineRuns || pipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  filteredPLRs?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  return (
    <>
      <Toolbar data-test="pipelinerun-list-toolbar" clearAllFilters={onClearFilters}>
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
                onClear={() => setNameFilter('')}
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
      {filteredPLRs.length > 0 ? (
        <Table
          data={filteredPLRs}
          aria-label="Pipeline run List"
          Header={PipelineRunListHeader}
          Row={PipelineRunListRow}
          loaded={loaded}
          getRowProps={(obj: PipelineRunKind) => ({
            id: obj.metadata.name,
          })}
        />
      ) : (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      )}
    </>
  );
};

export default PipelineRunsListView;
