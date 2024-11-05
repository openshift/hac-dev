import * as React from 'react';
import {
  Bullseye,
  SearchInput,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  debounce,
  capitalize,
} from '@patternfly/react-core';
import {
  Select,
  SelectVariant,
  SelectGroup,
  SelectOption,
} from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { PipelineRunLabel, PipelineRunType } from '../../../consts/pipelinerun';
import { usePLRVulnerabilities } from '../../../hooks/useScanResults';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { Table } from '../../../shared';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import { PipelineRunKind } from '../../../types';
import { statuses } from '../../../utils/commits-utils';
import { pipelineRunStatus } from '../../../utils/pipeline-utils';
import PipelineRunEmptyState from '../../PipelineRunDetailsView/PipelineRunEmptyState';
import { PipelineRunListHeaderWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListHeader';
import { PipelineRunListRowWithVulnerabilities } from '../../PipelineRunListView/PipelineRunListRow';

const pipelineRunTypes = [PipelineRunType.BUILD as string, PipelineRunType.TEST as string];

type SnapshotPipelineRunListProps = {
  snapshotPipelineRuns: PipelineRunKind[];
  applicationName: string;
  loaded: boolean;
  getNextPage;
  customFilter?: (plr: PipelineRunKind) => boolean;
};
const SnapshotPipelineRunsList: React.FC<React.PropsWithChildren<SnapshotPipelineRunListProps>> = ({
  snapshotPipelineRuns,
  applicationName,
  loaded,
  getNextPage,
  customFilter,
}) => {
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [name, setName] = React.useState('');
  const [typeFilterExpanded, setTypeFilterExpanded] = React.useState<boolean>(false);
  const [typeFiltersParam, setTypeFiltersParam] = useSearchParam('type', '');
  const [statusFilterExpanded, setStatusFilterExpanded] = React.useState<boolean>(false);
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const requestQueue = React.useRef<Function[]>([]);
  const [onLoadName, setOnLoadName] = React.useState(nameFilter);

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const typeFilters = React.useMemo(
    () => (typeFiltersParam ? typeFiltersParam.split(',') : []),
    [typeFiltersParam],
  );

  const setTypeFilters = (filters: string[]) => setTypeFiltersParam(filters.join(','));

  const statusFilterObj = React.useMemo(() => {
    return snapshotPipelineRuns.reduce((acc, plr) => {
      const status = pipelineRunStatus(plr);
      if (statuses.includes(status)) {
        if (acc[status] !== undefined) {
          acc[status] = acc[status] + 1;
        } else {
          acc[status] = 1;
        }
      }
      return acc;
    }, {});
  }, [snapshotPipelineRuns]);

  const typeFilterObj = React.useMemo(() => {
    return snapshotPipelineRuns.reduce((acc, plr) => {
      const runType = plr?.metadata.labels[PipelineRunLabel.PIPELINE_TYPE];
      if (pipelineRunTypes.includes(runType)) {
        if (acc[runType] !== undefined) {
          acc[runType] = acc[runType] + 1;
        } else {
          acc[runType] = 1;
        }
      }
      return acc;
    }, {});
  }, [snapshotPipelineRuns]);

  const onClearFilters = () => {
    onLoadName.length && setOnLoadName('');
    setNameFilter('');
    setName('');
    setStatusFilters([]);
    setTypeFilters([]);
  };
  const onNameInput = debounce((n: string) => {
    n.length === 0 && onLoadName.length && setOnLoadName('');

    setNameFilter(n);
    setName(n);
  }, 600);

  const filteredPLRs = React.useMemo(
    () =>
      snapshotPipelineRuns
        .filter((plr) => {
          const runType = plr?.metadata.labels[PipelineRunLabel.PIPELINE_TYPE];
          return (
            (!nameFilter ||
              plr.metadata.name.indexOf(nameFilter) >= 0 ||
              plr.metadata.labels?.[PipelineRunLabel.COMPONENT]?.indexOf(
                nameFilter.trim().toLowerCase(),
              ) >= 0) &&
            (!statusFilters.length || statusFilters.includes(pipelineRunStatus(plr))) &&
            (!typeFilters.length || typeFilters.includes(runType))
          );
        })
        .filter((plr) => !customFilter || customFilter(plr)),
    [customFilter, nameFilter, snapshotPipelineRuns, typeFilters, statusFilters],
  );

  const vulnerabilities = usePLRVulnerabilities(name ? filteredPLRs : snapshotPipelineRuns);

  React.useEffect(() => {
    if (
      vulnerabilities.fetchedPipelineRuns.length === filteredPLRs.length &&
      requestQueue.current.length
    ) {
      const [nextPage] = requestQueue.current;
      nextPage?.();
      requestQueue.current = [];
    }
  }, [vulnerabilities, filteredPLRs.length]);

  if (!loaded) {
    return (
      <Bullseye data-test="snapshot-plr-loading">
        <Spinner />
      </Bullseye>
    );
  }

  if (!nameFilter && snapshotPipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  if (!snapshotPipelineRuns || snapshotPipelineRuns.length === 0) {
    return <PipelineRunEmptyState applicationName={applicationName} />;
  }

  const EmptyMsg = () => <FilteredEmptyState onClearFilters={onClearFilters} />;

  return (
    <>
      <Title
        headingLevel="h4"
        className="pf-v5-c-title pf-v5-u-mt-lg pf-v5-u-mb-lg"
        data-test="snapshot-plr-title"
      >
        Pipeline runs
      </Title>
      <Toolbar data-test="pipelinerun-list-toolbar" clearAllFilters={onClearFilters}>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignLeft' }}>
            <ToolbarItem className="pf-v5-u-ml-0">
              <SearchInput
                name="nameInput"
                data-test="plr-name-filter"
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
            <ToolbarItem>
              <Select
                placeholderText="Type"
                data-test="plr-type-filter"
                toggleIcon={<FilterIcon />}
                toggleAriaLabel="Type filter menu"
                variant={SelectVariant.checkbox}
                isOpen={typeFilterExpanded}
                onToggle={(ev, expanded) => setTypeFilterExpanded(expanded)}
                onSelect={(event, selection) => {
                  const checked = (event.target as HTMLInputElement).checked;
                  setTypeFilters(
                    checked
                      ? [...typeFilters, String(selection)]
                      : typeFilters.filter((value) => value !== selection),
                  );
                }}
                selections={typeFilters}
                isGrouped
              >
                {[
                  <SelectGroup label="Type" key="type">
                    {Object.keys(typeFilterObj).map((filter) => (
                      <SelectOption
                        key={filter}
                        value={filter}
                        isChecked={typeFilters.includes(filter)}
                        itemCount={typeFilterObj[filter] ?? 0}
                      >
                        {capitalize(filter)}
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
          key={`${snapshotPipelineRuns.length}-${vulnerabilities.fetchedPipelineRuns.length}`}
          data={filteredPLRs}
          aria-label="Pipeline run List"
          customData={vulnerabilities}
          Header={PipelineRunListHeaderWithVulnerabilities}
          Row={PipelineRunListRowWithVulnerabilities}
          EmptyMsg={EmptyMsg}
          loaded
          getRowProps={(obj: PipelineRunKind) => ({
            id: obj.metadata.name,
          })}
          onRowsRendered={({ stopIndex }) => {
            if (stopIndex === filteredPLRs.length - 1 && !nameFilter) {
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
      ) : (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      )}
    </>
  );
};

export default SnapshotPipelineRunsList;
