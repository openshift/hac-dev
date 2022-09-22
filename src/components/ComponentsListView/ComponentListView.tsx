import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  DataList,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Label,
  SearchInput,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useApplicationRoutes } from '../../hooks';
import { useGitOpsDeploymentCR } from '../../hooks/useGitOpsDeploymentCR';
import { useSearchParam } from '../../hooks/useSearchParam';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../shared/components/pipeline-run-logs/types';
import { ComponentKind } from '../../types';
import { BUILD_COMPONENT_LABEL } from '../../utils/const';
import {
  getGitOpsDeploymentHealthStatusIcon,
  getGitOpsDeploymentStrategy,
} from '../../utils/gitops-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import { ComponentListItem } from './ComponentListItem';
import ComponentsFilterToolbarGroups, {
  getStatusFilterIdForComponent,
} from './ComponentsFilterToolbarGroups';

export type BuildStatusComponentProps = {
  component: ComponentKind;
  allComponents: ComponentKind[];
};

type ComponentListViewProps = {
  applicationName: string;
  components: ComponentKind[];
  additionalStatusFilter?: (
    component: ComponentKind,
    statusFilters: string[],
    pipelineRunBuilds: PipelineRunKind[],
  ) => boolean;
  renderToolbarGroups?: (
    statusFilters: string[],
    setStatusFilters: (filters: string[]) => void,
    pipelineBuildRuns: PipelineRunKind[],
  ) => React.ReactNode;
  renderTitle?: (pipelineBuildRuns: PipelineRunKind[]) => React.ReactNode;
  statusFilterCounts?: {
    [key: string]: number;
  };
  BuildStatusComponent?: React.ComponentType<BuildStatusComponentProps>;
};

const ComponentsFilteredState: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
  <EmptyState data-test="components-list-view__all-filtered">
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No components match the filter criteria. Remove filters or clear all filters to show results.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button
        variant="link"
        onClick={onClearFilters}
        data-test="components-list-view__clear-filters"
      >
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

const ComponentListView: React.FC<ComponentListViewProps> = ({
  applicationName,
  components,
  additionalStatusFilter,
  renderToolbarGroups,
  BuildStatusComponent,
  renderTitle,
}) => {
  const namespace = useNamespace();
  const [routes, loaded] = useApplicationRoutes(applicationName, namespace);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const [pipelineRuns, pipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    namespace,
    selector: {
      matchExpressions: [
        {
          key: BUILD_COMPONENT_LABEL,
          operator: 'In',
          values: components?.map((c) => c.metadata.name),
        },
      ],
    },
  });

  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useGitOpsDeploymentCR(
    applicationName,
    namespace,
  );
  const gitOpsDeploymentHealthStatus = gitOpsDeploymentLoaded
    ? gitOpsDeployment?.status?.health?.status
    : null;
  const gitOpsDeploymentHealthStatusIcon = getGitOpsDeploymentHealthStatusIcon(
    gitOpsDeploymentHealthStatus,
  );

  const onClearFilters = () => {
    setNameFilter('');
    setStatusFiltersParam('');
  };

  const filteredComponents = React.useMemo(
    () =>
      components.filter((component) => {
        const compStatus = statusFilters?.length
          ? getStatusFilterIdForComponent(component, pipelineRuns)
          : '';
        return (
          (!nameFilter || component.metadata.name.indexOf(nameFilter) !== -1) &&
          (!statusFilters?.length ||
            statusFilters.includes(compStatus) ||
            additionalStatusFilter?.(component, statusFilters, pipelineRuns))
        );
      }),
    [components, statusFilters, pipelineRuns, nameFilter, additionalStatusFilter],
  );

  const toolbarGroups = () =>
    renderToolbarGroups ? (
      renderToolbarGroups(statusFilters, setStatusFilters, pipelineRuns)
    ) : (
      <ComponentsFilterToolbarGroups
        components={components}
        pipelineRuns={pipelineRuns}
        statusFilters={statusFilters}
        setStatusFilters={setStatusFilters}
      />
    );

  if (!loaded || !pipelineRunsLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <>
      {renderTitle ? renderTitle(pipelineRuns) : null}
      <Toolbar
        data-testid="component-list-toolbar"
        clearFiltersButtonText="Clear filters"
        clearAllFilters={() => setStatusFiltersParam('')}
      >
        <ToolbarContent>
          {toolbarGroups()}
          <ToolbarItem>
            <SearchInput
              name="nameInput"
              data-test="name-input-filter"
              type="search"
              aria-label="name filter"
              placeholder="Filter by name..."
              onChange={setNameFilter}
              value={nameFilter}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant="secondary"
              component={(p) => (
                <Link
                  {...p}
                  data-test="add-component-button"
                  to={`/app-studio/import?application=${applicationName}`}
                />
              )}
            >
              Add component
            </Button>
          </ToolbarItem>
          <ToolbarGroup alignment={{ default: 'alignRight' }}>
            {gitOpsDeploymentLoaded ? (
              gitOpsDeployment ? (
                <>
                  <ToolbarItem>
                    {gitOpsDeploymentHealthStatusIcon} Application {gitOpsDeploymentHealthStatus}
                  </ToolbarItem>
                  <ToolbarItem
                    style={{
                      color: 'var(--pf-global--palette--black-600)',
                    }}
                  >
                    |
                  </ToolbarItem>
                  <ToolbarItem>
                    Deployment strategy:{' '}
                    <Label>{getGitOpsDeploymentStrategy(gitOpsDeployment)}</Label>
                  </ToolbarItem>
                </>
              ) : null
            ) : (
              <Spinner isSVG size="md" />
            )}
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <DataList aria-label="Components" data-testid="component-list">
        {filteredComponents?.length ? (
          <>
            {filteredComponents?.map((component) => (
              <ComponentListItem
                key={component.metadata.uid}
                component={component}
                routes={routes}
                BuildStatusComponent={BuildStatusComponent}
                allComponents={components}
              />
            ))}
          </>
        ) : (
          <ComponentsFilteredState onClearFilters={onClearFilters} />
        )}
      </DataList>
    </>
  );
};

export default ComponentListView;
