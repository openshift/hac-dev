import * as React from 'react';
import {
  Bullseye,
  SearchInput,
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { useSearchParam } from '../../hooks/useSearchParam';
import ExternalLink from '../../shared/components/links/ExternalLink';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import { EnterpriseContractTable } from './EnterpriseContractTable/EnterpriseContractTable';
import { ENTERPRISE_CONTRACT_STATUS } from './types';
import { useEnterpriseContractResults } from './useEnterpriseContractResultFromLogs';

export const SecurityEnterpriseContractTab: React.FC<{ pipelineRun: string }> = ({
  pipelineRun,
}) => {
  const [ecResult, ecResultLoaded] = useEnterpriseContractResults(pipelineRun);

  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  // Status Filter
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
    const statusFilter = {
      [ENTERPRISE_CONTRACT_STATUS.successes]: 0,
      [ENTERPRISE_CONTRACT_STATUS.warnings]: 0,
      [ENTERPRISE_CONTRACT_STATUS.violations]: 0,
    };
    return ecResultLoaded
      ? ecResult.reduce((acc, ec) => {
          if (acc[ec.status]) {
            acc[ec.status] += 1;
          } else {
            acc[ec.status] = 1;
          }
          return acc;
        }, {})
      : statusFilter;
  }, [ecResult, ecResultLoaded]);

  // Component filter
  const [componentFilterExpanded, setComponentFilterExpanded] = React.useState<boolean>(false);
  const [componentFiltersParam, setComponentFiltersParam] = useSearchParam('component', '');

  const componentFilters = React.useMemo(
    () => (componentFiltersParam ? componentFiltersParam.split(',') : []),
    [componentFiltersParam],
  );

  const setComponentFilters = React.useCallback(
    (filters: string[]) => setComponentFiltersParam(filters.join(',')),
    [setComponentFiltersParam],
  );

  const componentFilterObj = React.useMemo(() => {
    return ecResultLoaded
      ? ecResult.reduce((acc, ec) => {
          if (acc[ec.component]) {
            acc[ec.component] += 1;
          } else {
            acc[ec.component] = 1;
          }
          return acc;
        }, {})
      : {};
  }, [ecResult, ecResultLoaded]);

  // Filter Toolbar chips

  const onDeleteChip = React.useCallback(
    (category, chip) => {
      if (category === 'Component') {
        setComponentFilters(componentFilters.filter((comp) => comp !== chip));
      } else if (category === 'Status') {
        setStatusFilters(statusFilters.filter((stat) => stat !== chip));
      } else {
        setComponentFilters([]);
        setStatusFilters([]);
      }
    },
    [componentFilters, setComponentFilters, setStatusFilters, statusFilters],
  );

  const onDeleteChipComponentGroup = React.useCallback(() => {
    setComponentFilters([]);
  }, [setComponentFilters]);

  const onClearAllFilters = React.useCallback(() => {
    onDeleteChip(undefined, undefined);
    setNameFilter('');
  }, [onDeleteChip, setNameFilter]);

  // filter data in table
  const filteredECResult = React.useMemo(() => {
    return ecResultLoaded && ecResult
      ? ecResult.filter((rule) => {
          return (
            (!nameFilter || rule.title.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) &&
            (!statusFilters.length || statusFilters.includes(rule.status)) &&
            (!componentFilters.length || componentFilters.includes(rule.component))
          );
        })
      : undefined;
  }, [componentFilters, ecResult, ecResultLoaded, nameFilter, statusFilters]);

  if (!ecResultLoaded && !filteredECResult) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      <TextContent style={{ marginTop: 'var(--pf-global--spacer--lg)' }}>
        <Text component={TextVariants.h3}>Testing apps against Enterprise Contract</Text>
        <Text component={TextVariants.p}>
          Enterprise Contract is a set of tools for verifying the provenance of application
          snapshots and validating them against a clearly defined policy.
          <br />
          Enterprise Contract policy is defined using the Rego policy language and is described in{' '}
          <ExternalLink
            href="https://enterprise-contract.github.io/ec-policies/release_policy.html"
            showIcon
          >
            Release Policy
          </ExternalLink>{' '}
          and{' '}
          <ExternalLink
            href="https://enterprise-contract.github.io/ec-policies/pipeline_policy.html"
            showIcon
          >
            Pipeline Policy
          </ExternalLink>
          .
        </Text>
      </TextContent>
      <TextContent style={{ marginTop: 'var(--pf-global--spacer--xl)' }}>
        <Text component={TextVariants.h3}>Results</Text>
      </TextContent>
      <Toolbar clearAllFilters={onClearAllFilters}>
        <ToolbarContent style={{ padding: 0 }}>
          <ToolbarGroup alignment={{ default: 'alignLeft' }}>
            <ToolbarItem>
              <ToolbarFilter
                chips={componentFilters}
                categoryName="Component"
                deleteChip={onDeleteChip}
                deleteChipGroup={onDeleteChipComponentGroup}
              >
                <Select
                  placeholderText="Component"
                  toggleAriaLabel="Component filter menu"
                  aria-label="Component"
                  data-testid="component-filter-menu"
                  variant={SelectVariant.checkbox}
                  isOpen={componentFilterExpanded}
                  onToggle={setComponentFilterExpanded}
                  onSelect={(event, selection) => {
                    const checked = (event.target as HTMLInputElement).checked;
                    setComponentFilters(
                      checked
                        ? [...componentFilters, String(selection)]
                        : componentFilters.filter((value) => value !== selection),
                    );
                  }}
                  selections={componentFilters}
                  isGrouped
                >
                  {Object.keys(componentFilterObj).map((filter) => (
                    <SelectOption
                      key={filter}
                      value={filter}
                      isChecked={componentFilters.includes(filter)}
                      itemCount={componentFilterObj[filter] ?? 0}
                    >
                      {filter}
                    </SelectOption>
                  ))}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter chips={statusFilters} categoryName="Status" deleteChip={onDeleteChip}>
                <Select
                  placeholderText="Status"
                  aria-label="Status"
                  toggleAriaLabel="Status filter menu"
                  data-testid="status-filter-menu"
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
                  {Object.keys(statusFilterObj).map((filter) => (
                    <SelectOption
                      key={filter}
                      value={filter}
                      aria-label={filter}
                      data-testid={`status-filter-${filter}`}
                      isChecked={statusFilters.includes(filter)}
                      itemCount={statusFilterObj[filter] ?? 0}
                    >
                      {filter}
                    </SelectOption>
                  ))}
                </Select>
              </ToolbarFilter>
            </ToolbarItem>

            <ToolbarItem className="pf-u-ml-0">
              <SearchInput
                name="nameInput"
                data-test="rule-input-filter"
                type="search"
                aria-label="rule filter"
                placeholder="Filter by rule..."
                onChange={(e, name) => setNameFilter(name)}
                value={nameFilter}
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {ecResultLoaded && filteredECResult.length > 0 ? (
        <EnterpriseContractTable ecResult={filteredECResult} />
      ) : (
        <FilteredEmptyState onClearFilters={onClearAllFilters} />
      )}
    </>
  );
};
