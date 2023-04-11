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
import { EnvironmentKind } from '../../types';
import { GitOpsDeploymentHealthStatus } from '../../types/gitops-deployment';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './environment-utils';

export type EnvironmentToolbarGroupsProps = {
  environments: EnvironmentKind[];
  showStatusFilter?: boolean;
  envStatusCounts?: { [key: string]: number };
  statusFilter?: GitOpsDeploymentHealthStatus[];
  setStatusFilter?: (statuses: string[] | null) => void;
  unsetStatusFilter?: () => void;
  validTypes?: EnvironmentType[];
  typesFilter: EnvironmentType[];
  setTypesFilter: (types: string[] | null) => void;
  unsetTypesFilter: () => void;
};

const EnvironmentToolbarGroups: React.FC<EnvironmentToolbarGroupsProps> = ({
  environments,
  validTypes,
  envStatusCounts,
  showStatusFilter = false,
  statusFilter = [],
  setStatusFilter = () => {},
  unsetStatusFilter = () => {},
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
}) => {
  const [filterIsExpanded, setFilterIsExpanded] = React.useState(false);

  const envTypeCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    environments?.forEach((env) => {
      const type = getEnvironmentType(env);
      if (!counts[type]) {
        counts[type] = 0;
      }
      counts[type] += 1;
    });
    return counts;
  }, [environments]);

  const currentFilters = React.useMemo(
    () => (showStatusFilter ? [...statusFilter, ...typesFilter] : typesFilter),
    [showStatusFilter, statusFilter, typesFilter],
  );

  if (!validTypes) {
    return null;
  }

  const filterMenuItems = [];
  if (showStatusFilter) {
    filterMenuItems.push(
      <SelectGroup label="Status" key="status">
        {Object.keys(GitOpsDeploymentHealthStatus).map((status) => {
          return (
            <SelectOption
              key={status}
              value={GitOpsDeploymentHealthStatus[status]}
              itemCount={envStatusCounts?.[status] ?? 0}
            >
              {GitOpsDeploymentHealthStatus[status]}
            </SelectOption>
          );
        })}
      </SelectGroup>,
    );
  }
  filterMenuItems.push(
    <SelectGroup label="Type" key="type">
      {validTypes.map((type) => (
        <SelectOption key={type} value={type} itemCount={envTypeCounts?.[type] ?? 0}>
          {getEnvironmentTypeLabel(type)}
        </SelectOption>
      ))}
    </SelectGroup>,
  );

  const onSelect = (event, selection) => {
    const checked = (event.target as HTMLInputElement).checked;
    if (validTypes.includes(EnvironmentType[String(selection)])) {
      setTypesFilter(
        checked
          ? [...typesFilter, String(selection)]
          : typesFilter.filter((value) => value !== selection),
      );
    } else if (showStatusFilter) {
      setStatusFilter(
        checked
          ? [...statusFilter, String(selection)]
          : statusFilter.filter((value) => value !== selection),
      );
    }
  };

  return (
    <ToolbarGroup variant="filter-group">
      <ToolbarFilter
        chips={typesFilter.map((key) => ({ key, node: getEnvironmentTypeLabel(key) }))}
        deleteChip={(type, chip: ToolbarChip) => {
          if (type) {
            setTypesFilter(typesFilter.filter((v) => v !== chip.key));
          } else {
            unsetTypesFilter();
          }
        }}
        deleteChipGroup={unsetTypesFilter}
        categoryName="Type"
      >
        <Select
          toggleIcon={<FilterIcon />}
          variant={SelectVariant.checkbox}
          toggleAriaLabel="filter menu"
          onToggle={setFilterIsExpanded}
          onSelect={onSelect}
          selections={currentFilters}
          isOpen={filterIsExpanded}
          placeholderText="Filter"
          isGrouped
        >
          {filterMenuItems}
        </Select>
      </ToolbarFilter>
      {showStatusFilter ? (
        <ToolbarFilter
          chips={statusFilter.map((key) => ({ key, node: key }))}
          deleteChip={(status, chip: ToolbarChip) => {
            if (status) {
              setStatusFilter(statusFilter.filter((v) => v !== chip.key));
            } else {
              unsetStatusFilter();
            }
          }}
          deleteChipGroup={() => unsetStatusFilter()}
          categoryName="Status"
        >
          {null}
        </ToolbarFilter>
      ) : null}
    </ToolbarGroup>
  );
};

export default EnvironmentToolbarGroups;
