import * as React from 'react';
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
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
import { debounce } from 'lodash-es';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useComponents } from '../../hooks/useComponents';
import { usePipelineRuns } from '../../hooks/usePipelineRuns';
import { usePLRVulnerabilities } from '../../hooks/useScanResults';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import ErrorEmptyState from '../../shared/components/empty-state/ErrorEmptyState';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { HttpError } from '../../shared/utils/error/http-error';
import { PipelineRunKind } from '../../types';
import { statuses } from '../../utils/commits-utils';
import { pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import PipelineRunEmptyState from '../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeaderWithVulnerabilities } from './PipelineRunListHeader';
import { PipelineRunListRowWithVulnerabilities } from './PipelineRunListRow';

type PipelineRunsListViewProps = {
  applicationName: string;
  componentName?: string;
  customFilter?: (plr: PipelineRunKind) => boolean;
};

const PipelineRunsListView: React.FC<React.PropsWithChildren<PipelineRunsListViewProps>> = ({
  applicationName,
  componentName,
  customFilter,
}) => {
  const { namespace } = useWorkspaceInfo();
  const [components, componentsLoaded] = useComponents(namespace, applicationName);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [name, setName] = React.useState('');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const requestQueue = React.useRef<Function[]>([]);
  const [onLoadName, setOnLoadName] = React.useState(nameFilter);
  React.useEffect(() => {
    if (nameFilter) {
      setOnLoadName(nameFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pipelineRuns, loaded, error, getNextPage] = usePipelineRuns(
    componentsLoaded ? namespace : null,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: {
            [PipelineRunLabel.APPLICATION]: applicationName,
          },
          ...(!onLoadName && {
            matchExpressions: [
              {
                key: `${PipelineRunLabel.COMPONENT}`,
                operator: 'In',
                values: componentName ? [componentName] : components?.map((c) => c.metadata?.name),
              },
            ],
          }),
          ...(onLoadName && { filterByName: onLoadName.trim().toLowerCase() }),
        },
      }),
      [applicationName, componentName, components, onLoadName],
    ),
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
    return pipelineRuns.reduce((acc, plr) => {
      const stat = pipelineRunStatus(plr);
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
      pipelineRuns
        .filter(
          (plr) =>
            (!nameFilter ||
              plr.metadata.name.indexOf(nameFilter) >= 0 ||
              plr.metadata.labels?.[PipelineRunLabel.COMPONENT]?.indexOf(
                nameFilter.trim().toLowerCase(),
              ) >= 0) &&
            (!statusFilters.length || statusFilters.includes(pipelineRunStatus(plr))),
        )
        .filter((plr) => !customFilter || customFilter(plr)),
    [customFilter, nameFilter, pipelineRuns, statusFilters],
  );

  const vulnerabilities = usePLRVulnerabilities(name ? filteredPLRs : pipelineRuns);

  React.useEffect(() => {
    if (
      vulnerabilities.fetchedPipelineRuns.length === pipelineRuns.length &&
      requestQueue.current.length
    ) {
      const [nextPage] = requestQueue.current;
      nextPage?.();
      requestQueue.current = [];
    }
  }, [vulnerabilities, pipelineRuns.length]);

  const onClearFilters = () => {
    onLoadName.length && setOnLoadName('');
    setNameFilter('');
    setName('');
    setStatusFilters([]);
  };
  const onNameInput = debounce((n: string) => {
    n.length === 0 && onLoadName.length && setOnLoadName('');

    setNameFilter(n);
    setName(n);
  }, 600);

  const EmptyMsg = () => <FilteredEmptyState onClearFilters={onClearFilters} />;
  const NoDataEmptyMsg = () => <PipelineRunEmptyState applicationName={applicationName} />;
  const DataToolbar = (
    <Toolbar data-test="pipelinerun-list-toolbar" clearAllFilters={onClearFilters}>
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignLeft' }}>
          <ToolbarItem className="pf-v5-u-ml-0">
            <SearchInput
              name="nameInput"
              data-test="name-input-filter"
              type="search"
              aria-label="name filter"
              placeholder="Filter by name..."
              onChange={(e, n) => onNameInput(n)}
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
              onToggle={(ev, expanded) => setStatusFilterExpanded(expanded)}
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
  );

  if (error) {
    const httpError = HttpError.fromCode(error ? (error as any).code : 404);
    return (
      <ErrorEmptyState
        httpError={httpError}
        title="Unable to load pipeline runs"
        body={httpError?.message.length ? httpError?.message : 'Something went wrong'}
      />
    );
  }
  return (
    <Table
      data={filteredPLRs}
      unfilteredData={pipelineRuns}
      NoDataEmptyMsg={NoDataEmptyMsg}
      EmptyMsg={EmptyMsg}
      Toolbar={DataToolbar}
      aria-label="Pipeline run List"
      customData={vulnerabilities}
      Header={PipelineRunListHeaderWithVulnerabilities}
      Row={PipelineRunListRowWithVulnerabilities}
      loaded={loaded}
      getRowProps={(obj: PipelineRunKind) => ({
        id: obj.metadata.name,
      })}
      onRowsRendered={({ stopIndex }) => {
        if (loaded && stopIndex === filteredPLRs.length - 1 && !nameFilter) {
          if (vulnerabilities.fetchedPipelineRuns.length === filteredPLRs.length) {
            getNextPage?.();
          } else {
            if (requestQueue.current.length === 0) {
              getNextPage && requestQueue.current.push(getNextPage);
            }
          }
        }
      }}
    />
  );
};

export default PipelineRunsListView;
