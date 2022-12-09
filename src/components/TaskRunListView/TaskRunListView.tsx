import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  SearchInput,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useSearchParam } from '../../hooks/useSearchParam';
import { Table } from '../../shared';
import { TaskRunGroupVersionKind, TaskRunKind } from '../../types';
import { TaskRunListHeader } from './TaskRunListHeader';
import TaskRunListRow from './TaskRunListRow';

type Props = { pipelineName: string; namespace: string };

const TaskRunListView: React.FC<Props> = ({ pipelineName, namespace }) => {
  const [taskRuns, loaded] = useK8sWatchResource<TaskRunKind[]>({
    groupVersionKind: TaskRunGroupVersionKind,
    namespace,
    isList: true,
    selector: {
      matchLabels: {
        'tekton.dev/pipelineRun': pipelineName,
      },
    },
  });

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

  const emptyMessage = (
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateIcon icon={SearchIcon} />
      <Title headingLevel="h2" size="lg">
        No results found
      </Title>
      <EmptyStateBody>
        No results match the filter criteria. Remove filters or clear all filters to show results.
      </EmptyStateBody>
      <EmptyStateSecondaryActions>
        <Button variant="link" onClick={onClearFilters} data-test="taskrun-clear-filters">
          Clear all filters
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );

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
          <ToolbarGroup alignment={{ default: 'alignLeft' }}>
            <ToolbarItem className="pf-u-ml-0">
              <SearchInput
                name="nameInput"
                data-test="name-input-filter"
                type="search"
                aria-label="name filter"
                placeholder="Filter by name..."
                onChange={(name) => onNameInput(name)}
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
        emptyMessage
      )}
    </>
  );
};

export default TaskRunListView;
