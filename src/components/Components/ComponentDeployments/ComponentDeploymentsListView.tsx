import * as React from 'react';
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  EmptyStateBody,
} from '@patternfly/react-core';
import { useAllEnvironments } from '../../../hooks/useAllEnvironments';
import { useApplicationRoutes } from '../../../hooks/useApplicationRoutes';
import { useLatestSuccessfulBuildPipelineRunForComponent } from '../../../hooks/usePipelineRuns';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { useSnapshotsEnvironmentBindings } from '../../../hooks/useSnapshotsEnvironmentBindings';
import emptyStateImgUrl from '../../../imgs/Commit.svg';
import { Table } from '../../../shared';
import AppEmptyState from '../../../shared/components/empty-state/AppEmptyState';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import { ComponentKind } from '../../../types';
import { getCommitsFromPLRs } from '../../../utils/commits-utils';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import ComponentDeploymentsListHeader from './ComponentDeploymentsListHeader';
import ComponentDeploymentsListRow from './ComponentDeploymentsListRow';

type DeploymentsToolbarProps = {
  nameFilter: string;
  onNameInput: (value: string) => void;
};

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
const DeploymentsToolbar: React.FC<React.PropsWithChildren<DeploymentsToolbarProps>> = React.memo(
  ({ nameFilter, onNameInput }) => (
    <Toolbar data-test="commit-list-toolbar" clearAllFilters={() => onNameInput('')}>
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignLeft' }}>
          <ToolbarItem className="pf-u-ml-0">
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
  ),
);

interface ComponentDeploymentsListViewProps {
  component: ComponentKind;
}

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
const ComponentDeploymentsListView: React.FC<
  React.PropsWithChildren<ComponentDeploymentsListViewProps>
> = ({ component }) => {
  const { namespace } = useWorkspaceInfo();
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const application = component.spec.application;
  const [environments, environmentsLoaded] = useAllEnvironments();
  const [snapshotEBs, sebLoaded] = useSnapshotsEnvironmentBindings(namespace, application);
  const [routes, routesLoaded] = useApplicationRoutes(application);

  const [pipelineRun, pipelineRunLoaded] = useLatestSuccessfulBuildPipelineRunForComponent(
    namespace,
    component.metadata.name,
  );
  const commit = React.useMemo(
    () => ((pipelineRunLoaded && pipelineRun && getCommitsFromPLRs([pipelineRun], 1)) || [])[0],
    [pipelineRunLoaded, pipelineRun],
  );

  const loaded = sebLoaded && environmentsLoaded && pipelineRunLoaded && routesLoaded;

  const filteredEnvironments = React.useMemo(
    () =>
      environments
        ? environments.filter(
            (environment) =>
              !nameFilter ||
              (environment.spec?.displayName || environment.metadata?.name)
                ?.toLowerCase()
                .indexOf(nameFilter.toLowerCase()) !== -1,
          )
        : [],
    [environments, nameFilter],
  );

  const NoDataEmptyMsg = () => (
    <AppEmptyState
      emptyStateImg={emptyStateImgUrl}
      title="Monitor the component builds that are currently deployed to your environments."
    >
      <EmptyStateBody>
        Monitor any activity that happens once you push a commit. We’ll build and test your source
        code, for both pull requests and merged code.
        <br />
        To get started, add a component and merge its pull request for a build pipeline.
      </EmptyStateBody>
    </AppEmptyState>
  );
  const EmptyMsg = () => <FilteredEmptyState onClearFilters={() => setNameFilter('')} />;

  const DataToolbar = <DeploymentsToolbar nameFilter={nameFilter} onNameInput={setNameFilter} />;

  return (
    <div data-testid="component-deployments-list-view">
      <Table
        data-testid="test-test-test"
        data={filteredEnvironments}
        unfilteredData={environments}
        aria-label="Deployments List"
        EmptyMsg={EmptyMsg}
        NoDataEmptyMsg={NoDataEmptyMsg}
        Toolbar={DataToolbar}
        Header={ComponentDeploymentsListHeader}
        Row={ComponentDeploymentsListRow}
        loaded={loaded}
        customData={{
          component,
          snapshotEBs,
          commit,
          pipelineRunName: pipelineRun?.metadata?.name,
          routes,
        }}
        getRowProps={(obj) => ({
          id: obj.sha,
        })}
      />
    </div>
  );
};

export default ComponentDeploymentsListView;
