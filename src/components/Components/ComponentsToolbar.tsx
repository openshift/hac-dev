import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  SearchInput,
  Toolbar,
  ToolbarChip,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { useSearchParam } from '../../hooks/useSearchParam';
import { ComponentModel } from '../../models';
import { ComponentKind, PipelineRunKind } from '../../types';
import { pipelineRunStatus, runStatus } from '../../utils/pipeline-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';

export const FAILED_STATUS_FILTER_ID = 'failed';
export const SUCCESS_STATUS_FILTER_ID = 'success';
export const BUILDING_STATUS_FILTER_ID = 'building';

export const RunStatusFilters = [
  {
    id: FAILED_STATUS_FILTER_ID,
    label: 'Build failed',
  },
  {
    id: SUCCESS_STATUS_FILTER_ID,
    label: 'Build successful',
  },
  {
    id: BUILDING_STATUS_FILTER_ID,
    label: 'Building',
  },
];

export const pipelineRunStatusFilterId = (pipelineRun: PipelineRunKind) => {
  if (!pipelineRun) {
    return '';
  }
  const status = pipelineRunStatus(pipelineRun);
  switch (status) {
    case runStatus.Succeeded:
      return SUCCESS_STATUS_FILTER_ID;
    case runStatus.Failed:
    case runStatus.FailedToStart:
      return FAILED_STATUS_FILTER_ID;
    case runStatus.Running:
    case runStatus['In Progress']:
      return BUILDING_STATUS_FILTER_ID;
    default:
      return '';
  }
};

type ComponentsToolbarProps = {
  applicationName: string;
  components: (ComponentKind & { latestBuildPipelineRun?: PipelineRunKind })[];
};

const ComponentsToolbar: React.FC<ComponentsToolbarProps> = ({ applicationName, components }) => {
  const { workspace } = useWorkspaceInfo();
  const [statusFilterIsExpanded, setStatusFilterIsExpanded] = React.useState(false);

  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');

  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const filterCounts = React.useMemo(() => {
    const counts = {
      [FAILED_STATUS_FILTER_ID]: 0,
      [SUCCESS_STATUS_FILTER_ID]: 0,
      [BUILDING_STATUS_FILTER_ID]: 0,
    };
    components.forEach((component) => {
      const statusId = pipelineRunStatusFilterId(component.latestBuildPipelineRun);
      if (statusId) {
        counts[statusId]++;
      }
    });
    return counts;
  }, [components]);

  return (
    <Toolbar
      data-testid="component-list-toolbar"
      clearFiltersButtonText="Clear filters"
      clearAllFilters={() => setStatusFiltersParam('')}
    >
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignLeft' }} variant="filter-group">
          <ToolbarFilter
            chips={statusFilters.map((key) => {
              const option = RunStatusFilters.find((o) => o.id === key);
              return { key: option?.id ?? '', node: option.label ?? null };
            })}
            deleteChip={(type, chip: ToolbarChip) => {
              if (type) {
                setStatusFilters(statusFilters.filter((v) => v !== chip.key));
              } else {
                setStatusFilters([]);
              }
            }}
            deleteChipGroup={() => {
              setStatusFilters([]);
            }}
            categoryName="Status"
          >
            <Select
              className="component-status-filter"
              placeholderText="Filter"
              toggleIcon={<FilterIcon />}
              toggleAriaLabel="filter menu"
              variant={SelectVariant.checkbox}
              onToggle={(ev, expanded) => setStatusFilterIsExpanded(expanded)}
              isOpen={statusFilterIsExpanded}
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
                  {RunStatusFilters.map((filter) => (
                    <SelectOption
                      key={filter.id}
                      value={filter.id}
                      isChecked={statusFilters.includes(filter.id)}
                      itemCount={filterCounts?.[filter.id] ?? 0}
                    >
                      {filter.label}
                    </SelectOption>
                  ))}
                </SelectGroup>,
              ]}
            </Select>
          </ToolbarFilter>
        </ToolbarGroup>
        <ToolbarItem>
          <SearchInput
            name="nameInput"
            data-testid="name-input-filter"
            type="search"
            aria-label="name filter"
            placeholder="Filter by name..."
            onChange={(e, name) => setNameFilter(name)}
            value={nameFilter}
          />
        </ToolbarItem>
        <ToolbarItem>
          <ButtonWithAccessTooltip
            variant="secondary"
            component={(p) => (
              <Link
                {...p}
                data-test="add-component-button"
                to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
              />
            )}
            isDisabled={!canCreateComponent}
            tooltip="You don't have access to add a component"
            analytics={{
              link_name: 'add-component',
              app_name: applicationName,
              workspace,
            }}
          >
            Add component
          </ButtonWithAccessTooltip>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default ComponentsToolbar;
