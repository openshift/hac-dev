import * as React from 'react';
import {
  ToolbarGroup,
  ToolbarFilter,
  Select,
  SelectVariant,
  SelectOption,
  ToolbarChip,
  SelectGroup,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons';
import EnvironmentListViewBase from '../../../components/Environment/EnvironmentListView';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { EnvironmentKind } from '../../../types';
import EnvironmentCard from './EnvironmentCard';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from './utils';

type Props = {
  validTypes?: EnvironmentType[];
};

const EnvironmentListView: React.FC<Props> = ({
  validTypes = Object.keys(EnvironmentType).map((t) => EnvironmentType[t]),
}) => {
  const [typesFilterParam, setTypesFilterParam, unsetTypesFilter] = useSearchParam('envType', '');
  const typesFilter = typesFilterParam.length
    ? typesFilterParam
        .split(',')
        .filter((v) => !validTypes.includes[v])
        .map((t) => EnvironmentType[t])
    : [];

  const setTypesFilter = React.useCallback(
    (value: string[]) => {
      setTypesFilterParam(value.join(','));
    },
    [setTypesFilterParam],
  );

  const [typesFilterIsExpanded, setTypesFilterIsExpanded] = React.useState(false);

  const statusMenuItems = [
    <SelectGroup label="Type" key="type">
      {validTypes.map((type) => (
        <SelectOption key={type} value={type}>
          {getEnvironmentTypeLabel(type)}
        </SelectOption>
      ))}
    </SelectGroup>,
  ];

  const filterToolbar = (
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

  const preFilter = (env: EnvironmentKind) => validTypes.includes(getEnvironmentType(env));

  const filter = (env: EnvironmentKind) => {
    const type = getEnvironmentType(env);
    return typesFilter.length ? typesFilter.includes(type) : true;
  };

  return (
    <EnvironmentListViewBase
      preFilter={preFilter}
      filterToolbar={filterToolbar}
      filter={filter}
      CardComponent={EnvironmentCard}
      onClearAllFilters={unsetTypesFilter}
      emptyStateContent={
        <>
          <Title headingLevel="h4" size="lg">
            Add static environments or link to external, managed environments as your release
            destination
          </Title>
          <EmptyStateBody>
            No environments found yet.
            <br />
            To get started, create an environment or connect to a release environment.
          </EmptyStateBody>
        </>
      }
    />
  );
};

export default EnvironmentListView;
