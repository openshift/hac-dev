import * as React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  SearchInput,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { TaskRunKind } from '../../types';
import { TaskRunListHeader } from './TaskRunListHeader';
import TaskRunListRow from './TaskRunListRow';

type Props = { taskRuns: TaskRunKind[]; loaded: boolean };

const TaskRunListView: React.FC<React.PropsWithChildren<Props>> = ({ taskRuns, loaded }) => {
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const sortedTaskRuns = React.useMemo(
    () =>
      taskRuns?.sort(
        (a, b) => +new Date(a.metadata.creationTimestamp) - +new Date(b.metadata.creationTimestamp),
      ),
    [taskRuns],
  );

  const filteredTaskRun = React.useMemo(
    () =>
      nameFilter
        ? sortedTaskRuns.filter(
            (taskrun) =>
              taskrun.metadata.name.indexOf(nameFilter) !== -1 ||
              taskrun.spec?.taskRef?.name?.indexOf(nameFilter) !== -1,
          )
        : sortedTaskRuns,
    [nameFilter, sortedTaskRuns],
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

  if (!taskRuns || taskRuns.length === 0) {
    return (
      <EmptyState data-test="taskrun-empty-state">
        <EmptyStateBody>No task runs found</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <>
      <Toolbar data-test="taskrun-list-toolbar" clearAllFilters={onClearFilters}>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignLeft' }}>
            <ToolbarItem className="pf-v5-u-ml-0">
              <SearchInput
                name="nameInput"
                data-test="name-input-filter"
                type="search"
                aria-label="name filter"
                placeholder="Filter by name..."
                onChange={(e, name) => onNameInput(name)}
                value={nameFilter}
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {filteredTaskRun.length > 0 ? (
        <Table
          data={filteredTaskRun}
          aria-label="TaskRun List"
          Header={TaskRunListHeader}
          Row={TaskRunListRow}
          loaded={loaded}
        />
      ) : (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      )}
    </>
  );
};

export default TaskRunListView;
