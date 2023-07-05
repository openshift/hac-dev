import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  AlertVariant,
  Bullseye,
  DataList,
  EmptyStateBody,
  Label,
  pluralize,
  SearchInput,
  Spinner,
  Text,
  TextContent,
  TextVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { useApplicationRoutes } from '../../hooks/useApplicationRoutes';
import { useComponents } from '../../hooks/useComponents';
import { useAllGitOpsDeploymentCRs } from '../../hooks/useGitOpsDeploymentCR';
import { PACState } from '../../hooks/usePACState';
import { usePipelineRuns } from '../../hooks/usePipelineRuns';
import { useSearchParam } from '../../hooks/useSearchParam';
import { useSnapshotsEnvironmentBindings } from '../../hooks/useSnapshotsEnvironmentBindings';
import emptyStateImgUrl from '../../imgs/Components.svg';
import { ComponentModel } from '../../models';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { useURLForComponentPRs } from '../../utils/component-utils';
import { getGitOpsDeploymentStrategy } from '../../utils/gitops-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import AppEmptyState from '../EmptyState/AppEmptyState';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import { useModalLauncher } from '../modal/ModalProvider';
import { ComponentListItem } from './ComponentListItem';
import ComponentsFilterToolbarGroups, {
  getStatusFilterIdForComponent,
} from './ComponentsFilterToolbarGroups';

type ComponentListViewProps = {
  applicationName: string;
};

const ComponentListView: React.FC<ComponentListViewProps> = ({ applicationName }) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const [routes, loaded] = useApplicationRoutes(applicationName);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const [mergeAlertHidden, setMergeAlertHidden] = React.useState<boolean>(false);

  const [allComponents, componentsLoaded] = useComponents(namespace, applicationName);
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  const showModal = useModalLauncher();

  const components = React.useMemo(
    () =>
      componentsLoaded ? allComponents?.filter((c) => c.spec.application === applicationName) : [],
    [allComponents, applicationName, componentsLoaded],
  );

  const prURL = useURLForComponentPRs(components);

  // TODO this is inefficient to fetch all unbounded pipeline runs for the sake of creating filters
  const [pipelineRuns, pipelineRunsLoaded] = usePipelineRuns(
    namespace,
    React.useMemo(
      () => ({
        selector: {
          matchLabels: { [PipelineRunLabel.APPLICATION]: applicationName },
        },
      }),
      [applicationName],
    ),
  );

  const [snapshotEBs, snapshotLoaded] = useSnapshotsEnvironmentBindings(namespace, applicationName);

  const [gitOpsDeployments, gitOpsDeploymentLoaded, gitOpsDeploymentError] =
    useAllGitOpsDeploymentCRs(namespace);

  const allLoaded = React.useMemo(
    () => snapshotLoaded && gitOpsDeploymentLoaded && !gitOpsDeploymentError,
    [snapshotLoaded, gitOpsDeploymentLoaded, gitOpsDeploymentError],
  );

  const allData = React.useMemo(
    () =>
      allLoaded &&
      gitOpsDeployments &&
      Array.isArray(gitOpsDeployments) &&
      gitOpsDeployments.length > 0 &&
      snapshotEBs &&
      Array.isArray(snapshotEBs) &&
      snapshotEBs.length > 0,
    [allLoaded, gitOpsDeployments, snapshotEBs],
  );

  const statusFilters = React.useMemo(
    () => (statusFiltersParam ? statusFiltersParam.split(',') : []),
    [statusFiltersParam],
  );

  const setStatusFilters = React.useCallback(
    (filters: string[]) => setStatusFiltersParam(filters.join(',')),
    [setStatusFiltersParam],
  );

  const onClearFilters = () => {
    setNameFilter('');
    setStatusFiltersParam('');
  };

  const [componentState, setComponentState] = React.useState<{ [name: string]: PACState }>({});

  const pendingCount = React.useMemo(
    () => Object.values(componentState).reduce((p, c) => (c === PACState.pending ? p + 1 : p), 0),
    [componentState],
  );

  const filteredComponents = React.useMemo(
    () =>
      components.filter((component) => {
        const compStatus = statusFilters?.length
          ? getStatusFilterIdForComponent(component, pipelineRuns)
          : '';
        return (
          (!nameFilter || component.metadata.name.indexOf(nameFilter) !== -1) &&
          (!statusFilters?.length || statusFilters.includes(compStatus))
        );
      }),
    [components, statusFilters, pipelineRuns, nameFilter],
  );

  return (
    <>
      {!loaded || !pipelineRunsLoaded ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <>
          {allComponents?.length > 0 ? (
            <>
              <Title headingLevel="h3" className="pf-u-mt-lg pf-u-mb-sm">
                Components
              </Title>
              <TextContent>
                <Text component={TextVariants.p}>
                  A component is an image built from source code in a repository. One or more
                  components that run together form an application.
                </Text>
              </TextContent>
              {pendingCount > 0 && !mergeAlertHidden ? (
                <Alert
                  className="pf-u-mt-md"
                  variant={AlertVariant.warning}
                  isInline
                  title={`${pluralize(
                    pendingCount,
                    'component is',
                    'components are',
                  )} missing a build pipeline definition`}
                  actionClose={<AlertActionCloseButton onClose={() => setMergeAlertHidden(true)} />}
                  actionLinks={
                    <>
                      <AlertActionLink
                        onClick={() =>
                          showModal(
                            createCustomizeAllPipelinesModalLauncher(applicationName, namespace),
                          )
                        }
                      >
                        Manage build pipelines
                      </AlertActionLink>
                      <ExternalLink href={prURL} showIcon>
                        View all pull requests in Github
                      </ExternalLink>
                    </>
                  }
                  data-testid="components-unmerged-build-pr"
                >
                  We sent a pull request to your repository containing the default build pipeline
                  for you to customize. Merge the pull request to set up a build pipeline for your
                  component.
                </Alert>
              ) : null}

              <Toolbar
                data-testid="component-list-toolbar"
                clearFiltersButtonText="Clear filters"
                clearAllFilters={() => setStatusFiltersParam('')}
              >
                <ToolbarContent>
                  <ComponentsFilterToolbarGroups
                    components={components}
                    pipelineRuns={pipelineRuns}
                    statusFilters={statusFilters}
                    setStatusFilters={setStatusFilters}
                  />
                  <ToolbarItem>
                    <SearchInput
                      name="nameInput"
                      data-testid="name-input-filter"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={(e, name) => setNameFilter(name)}
                      value={nameFilter}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <ButtonWithAccessTooltip
                      variant="secondary"
                      component={(p) => (
                        <Link
                          {...p}
                          data-test="add-component-button"
                          to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
                        />
                      )}
                      isDisabled={!canCreateComponent}
                      tooltip="You don't have access to add a component"
                      analytics={{
                        link_name: 'add-component',
                        app_name: applicationName,
                        workspace,
                      }}
                    >
                      Add component
                    </ButtonWithAccessTooltip>
                  </ToolbarItem>
                  <ToolbarGroup alignment={{ default: 'alignRight' }}>
                    {!gitOpsDeploymentError && gitOpsDeploymentLoaded ? (
                      Array.isArray(gitOpsDeployments) &&
                      gitOpsDeployments.length > 0 &&
                      gitOpsDeployments[0] ? (
                        <ToolbarItem>
                          Deployment strategy:{' '}
                          <Label>{getGitOpsDeploymentStrategy(gitOpsDeployments[0])}</Label>
                        </ToolbarItem>
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
                    {filteredComponents?.map((component) => {
                      if (allData) {
                        const gitOpsDeploymentData =
                          snapshotEBs[0]?.status?.gitopsDeployments?.find(
                            (deployment) => deployment.componentName === component.metadata.name,
                          );
                        const gitOpsDeploymentCR = gitOpsDeployments.find(
                          (deployment) =>
                            deployment.metadata.name === gitOpsDeploymentData?.gitopsDeployment,
                        );

                        return gitOpsDeploymentCR ? (
                          <ComponentListItem
                            key={component.metadata.uid}
                            component={component}
                            routes={routes}
                            gitOpsDeployment={gitOpsDeploymentCR}
                            onStateChange={(state) =>
                              setComponentState((prev) => ({
                                ...prev,
                                [component.metadata.name]: state,
                              }))
                            }
                          />
                        ) : (
                          <ComponentListItem
                            key={component.metadata.uid}
                            component={component}
                            routes={routes}
                            onStateChange={(state) =>
                              setComponentState((prev) => ({
                                ...prev,
                                [component.metadata.name]: state,
                              }))
                            }
                          />
                        );
                      }
                      return (
                        <ComponentListItem
                          key={component.metadata.uid}
                          component={component}
                          routes={routes}
                          onStateChange={(state) =>
                            setComponentState((prev) => ({
                              ...prev,
                              [component.metadata.name]: state,
                            }))
                          }
                        />
                      );
                    })}
                  </>
                ) : (
                  <FilteredEmptyState
                    onClearFilters={onClearFilters}
                    data-test="components-list-view__all-filtered"
                  />
                )}
              </DataList>
            </>
          ) : (
            <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Bring your application to life">
              <EmptyStateBody>
                A component is an image built from source code in a repository. One or more
                components that run together form an application.
                <br />
                To get started, add a component to your application.{' '}
              </EmptyStateBody>
              <ButtonWithAccessTooltip
                variant="primary"
                component={(props) => (
                  <Link
                    {...props}
                    to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
                  />
                )}
                isDisabled={!canCreateComponent}
                tooltip="You don't have access to add a component"
                analytics={{
                  link_name: 'add-component',
                  link_location: 'components-list-empty-state',
                  app_name: applicationName,
                  workspace,
                }}
              >
                Add component
              </ButtonWithAccessTooltip>
            </AppEmptyState>
          )}
        </>
      )}
    </>
  );
};

export default ComponentListView;
