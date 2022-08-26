import * as React from 'react';
import {
  ToolbarGroup,
  ToolbarFilter,
  Select,
  SelectVariant,
  SelectOption,
  ToolbarChip,
  SelectGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons';
import { EnvironmentKind } from '../../../types';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './utils';

export type EnvironmentToolbarGroupsProps = {
  environments: EnvironmentKind[];
  validTypes?: EnvironmentType[];
  typesFilter: EnvironmentType[];
  setTypesFilter: (types: string[] | null) => void;
  unsetTypesFilter: () => void;
};

const EnvironmentToolbarGroups: React.FC<EnvironmentToolbarGroupsProps> = ({
  environments,
  validTypes,
  typesFilter,
  setTypesFilter,
  unsetTypesFilter,
}) => {
  const [typesFilterIsExpanded, setTypesFilterIsExpanded] = React.useState(false);

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

  if (!validTypes) {
    return null;
  }

  const statusMenuItems = [
    <SelectGroup label="Type" key="type">
      {validTypes.map((type) => (
        <SelectOption key={type} value={type} itemCount={envTypeCounts?.[type] ?? 0}>
          {getEnvironmentTypeLabel(type)}
        </SelectOption>
      ))}
    </SelectGroup>,
  ];

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
        deleteChipGroup={() => {
          unsetTypesFilter();
        }}
        categoryName="Type"
      >
        <Select
          toggleIcon={<FilterIcon />}
          variant={SelectVariant.checkbox}
          toggleAriaLabel="filter menu"
          onToggle={setTypesFilterIsExpanded}
          onSelect={(event, selection) => {
            const checked = (event.target as HTMLInputElement).checked;
            setTypesFilter(
              checked
                ? [...typesFilter, String(selection)]
                : typesFilter.filter((value) => value !== selection),
            );
          }}
          selections={typesFilter}
          isOpen={typesFilterIsExpanded}
          placeholderText="Filter"
          isGrouped
        >
          {statusMenuItems}
        </Select>
      </ToolbarFilter>
    </ToolbarGroup>
  );
};

export default EnvironmentToolbarGroups;
