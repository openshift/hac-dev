import * as React from 'react';
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { useSearchParam } from '../../hooks/useSearchParam';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import Table from '../../shared/components/table/Table';
import { WorkspaceContext } from '../../utils/workspace-context-utils';
import WorkspaceEmptyState from './WorkspaceEmptyState';
import WorkspaceListHeader from './WorkspaceListHeader';
import WorkspaceListRow from './WorkspaceListRow';

const WorkspaceListView: React.FC = () => {
  const { konfluxWorkspaces, workspacesLoaded } = React.useContext(WorkspaceContext);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const filteredWorkspaces = React.useMemo(
    () =>
      workspacesLoaded && nameFilter
        ? konfluxWorkspaces?.filter((w) => w.metadata?.namespace?.indexOf(nameFilter) !== -1)
        : konfluxWorkspaces,
    [konfluxWorkspaces, nameFilter, workspacesLoaded],
  );

  const onClearFilters = () => {
    setNameFilter('');
  };
  const onNameInput = (name: string) => setNameFilter(name);

  const EmptyMessage = () => <FilteredEmptyState onClearFilters={onClearFilters} />;

  const DataToolbar = (
    <Toolbar data-test="commit-list-toolbar" clearAllFilters={onClearFilters}>
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
  );

  if (!konfluxWorkspaces || konfluxWorkspaces.length === 0) {
    return <WorkspaceEmptyState />;
  }
  return (
    <Table
      virtualize
      data={filteredWorkspaces}
      unfilteredData={konfluxWorkspaces}
      EmptyMsg={EmptyMessage}
      Toolbar={DataToolbar}
      aria-label="Workspace List"
      Header={WorkspaceListHeader}
      Row={WorkspaceListRow}
      loaded={workspacesLoaded}
      getRowProps={(obj) => ({
        id: obj.metadata.namespace,
      })}
    />
  );
};

export default WorkspaceListView;
