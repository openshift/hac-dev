import * as React from 'react';
import {
  Select,
  SelectGroup,
  SelectOption,
  SelectVariant,
  ToolbarChip,
  ToolbarFilter,
  ToolbarGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { PipelineRunLabel } from '../../hacbs/consts/pipelinerun';
import { PipelineRunKind } from '../../hacbs/types';
import { pipelineRunFilterReducer, runStatus } from '../../shared';
import { ComponentKind } from '../../types';

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

export const getStatusFilterIdForComponent = (component, pipelineRuns: PipelineRunKind[]) => {
  const latestPipelineRun = pipelineRuns
    .filter((pr) => pr.metadata.labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name)
    .sort(
      (a, b) =>
        new Date(b.metadata.creationTimestamp).getTime() -
        new Date(a.metadata.creationTimestamp).getTime(),
    )?.[0];
  if (latestPipelineRun) {
    const status = pipelineRunFilterReducer(latestPipelineRun);
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
  }
  return '';
};

export type ComponentsFilterToolbarProps = {
  components: ComponentKind[];
  pipelineRuns: PipelineRunKind[];
  runStatusOptions?: { id: string; label: string }[];
  statusFilters?: string[];
  setStatusFilters: (filters: string[]) => void;
  customFilterCounts?: { [status: string]: number };
};

const ComponentsFilterToolbarGroups: React.FC<ComponentsFilterToolbarProps> = ({
  components,
  pipelineRuns,
  runStatusOptions = RunStatusFilters,
  statusFilters,
  setStatusFilters,
  customFilterCounts,
}) => {
  const [statusFilterIsExpanded, setStatusFilterIsExpanded] = React.useState(false);

  const filterCounts = React.useMemo(() => {
    if (customFilterCounts) {
      return customFilterCounts;
    }
    const counts = {
      [FAILED_STATUS_FILTER_ID]: 0,
      [SUCCESS_STATUS_FILTER_ID]: 0,
      [BUILDING_STATUS_FILTER_ID]: 0,
    };
    components.forEach((component) => {
      const statusId = getStatusFilterIdForComponent(component, pipelineRuns);
      if (statusId) {
        counts[statusId]++;
      }
    });
    return counts;
  }, [components, customFilterCounts, pipelineRuns]);

  return (
    <ToolbarGroup alignment={{ default: 'alignLeft' }} variant="filter-group">
      <ToolbarFilter
        chips={statusFilters.map((key) => {
          const option = runStatusOptions.find((o) => o.id === key);
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
          onToggle={setStatusFilterIsExpanded}
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
              {runStatusOptions.map((filter) => (
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
  );
};

export default ComponentsFilterToolbarGroups;
