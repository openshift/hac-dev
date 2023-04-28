import * as React from 'react';
import {
  Bullseye,
  Button,
  Flex,
  FlexItem,
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
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import SecurityTabEmptyState from '../EmptyState/SecurityTabEmptyState';
import { EnterpriseContractTable } from './EnterpriseContractTable/EnterpriseContractTable';
import { ENTERPRISE_CONTRACT_STATUS } from './types';
import { useEnterpriseContractResults } from './useEnterpriseContractResultFromLogs';
import { getRuleStatus } from './utils';

const getResultsSummary = (ECs, ecLoaded) => {
  const statusFilter = {
    [ENTERPRISE_CONTRACT_STATUS.successes]: 0,
    [ENTERPRISE_CONTRACT_STATUS.warnings]: 0,
    [ENTERPRISE_CONTRACT_STATUS.violations]: 0,
  };
  return ecLoaded && ECs
    ? ECs?.reduce((acc, ec) => {
        if (acc[ec.status]) {
          acc[ec.status] += 1;
        } else {
          acc[ec.status] = 1;
        }
        return acc;
      }, statusFilter)
    : statusFilter;
};

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

  const statusFilterObj = React.useMemo(
    () => getResultsSummary(ecResult, ecResultLoaded),
    [ecResult, ecResultLoaded],
  );

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
      ? ecResult?.reduce((acc, ec) => {
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
      ? ecResult?.filter((rule) => {
          return (
            (!nameFilter || rule.title.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1) &&
            (!statusFilters.length || statusFilters.includes(rule.status)) &&
            (!componentFilters.length || componentFilters.includes(rule.component))
          );
        })
      : undefined;
  }, [componentFilters, ecResult, ecResultLoaded, nameFilter, statusFilters]);

  // result summary
  const resultSummary = React.useMemo(
    () => getResultsSummary(filteredECResult, ecResultLoaded),
    [filteredECResult, ecResultLoaded],
  );

  if (!ecResultLoaded && !filteredECResult) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  } else if (ecResultLoaded && !filteredECResult) {
    return <SecurityTabEmptyState />;
  }

  return (
    <>
      <TextContent style={{ marginTop: 'var(--pf-global--spacer--lg)' }}>
        <Text component={TextVariants.h3}>Testing apps against Enterprise Contract</Text>
        <Text component={TextVariants.p}>
          Enterprise Contract is a set of tools for verifying the provenance of application
          snapshots and validating them against a clearly defined policy.
          <br />
          The Enterprise Contract policy is defined using the{' '}
          <Button
            variant="link"
            isInline
            component={(props) => (
              <a
                {...props}
                href="https://www.openpolicyagent.org/docs/latest/policy-language/"
                target="_blank"
                rel="noreferrer"
              />
            )}
          >
            rego policy language
          </Button>{' '}
          and is described here in{' '}
          <Button
            variant="link"
            isInline
            component={(props) => (
              <a
                {...props}
                href="https://enterprisecontract.dev/docs/ec-policies/index.html"
                target="_blank"
                rel="noreferrer"
              />
            )}
          >
            Enterprise Contract Policies
          </Button>
          .
        </Text>
      </TextContent>
      <Flex style={{ marginTop: 'var(--pf-global--spacer--xl)' }}>
        <FlexItem style={{ marginRight: 'var(--pf-global--spacer--2xl)' }}>
          <TextContent>
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
                  <ToolbarFilter
                    chips={statusFilters}
                    categoryName="Status"
                    deleteChip={onDeleteChip}
                  >
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
        </FlexItem>
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <TextContent>
              <Text component={TextVariants.h3}>Results summary</Text>
            </TextContent>
          </FlexItem>
          <Flex data-testid="result-summary" spaceItems={{ default: 'spaceItemsXl' }}>
            <FlexItem spacer={{ default: 'spacerXl' }}>
              <span style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                {getRuleStatus(ENTERPRISE_CONTRACT_STATUS.violations)}
              </span>
              <b>{resultSummary[ENTERPRISE_CONTRACT_STATUS.violations]}</b>
            </FlexItem>
            <FlexItem>
              <span style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                {getRuleStatus(ENTERPRISE_CONTRACT_STATUS.warnings)}
              </span>
              <b>{resultSummary[ENTERPRISE_CONTRACT_STATUS.warnings]}</b>
            </FlexItem>
            <FlexItem>
              <span style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                {getRuleStatus(ENTERPRISE_CONTRACT_STATUS.successes)}
              </span>
              <b>{resultSummary[ENTERPRISE_CONTRACT_STATUS.successes]}</b>
            </FlexItem>
          </Flex>
        </Flex>
      </Flex>
      {ecResultLoaded && filteredECResult.length > 0 ? (
        <EnterpriseContractTable ecResult={filteredECResult} />
      ) : (
        <FilteredEmptyState onClearFilters={onClearAllFilters} />
      )}
    </>
  );
};
