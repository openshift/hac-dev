import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  AlertVariant,
  Bullseye,
  Button,
  DataList,
  EmptyStateBody,
  Label,
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
import { useApplicationRoutes } from '../../hooks';
import { useComponents } from '../../hooks/useComponents';
import { useGitOpsDeploymentCR } from '../../hooks/useGitOpsDeploymentCR';
import { useSearchParam } from '../../hooks/useSearchParam';
import emptyStateImgUrl from '../../imgs/Components.svg';
import { PipelineRunGroupVersionKind } from '../../shared';
import { PipelineRunKind } from '../../types';
import { getURLForComponentPRs, isPACEnabled } from '../../utils/component-utils';
import { getGitOpsDeploymentStrategy } from '../../utils/gitops-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import AppEmptyState from '../EmptyState/AppEmptyState';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import { ComponentListItem } from './ComponentListItem';
import ComponentsFilterToolbarGroups, {
  NEEDS_MERGE_FILTER_ID,
  getStatusFilterIdForComponent,
} from './ComponentsFilterToolbarGroups';

type ComponentListViewProps = {
  applicationName: string;
};

const ComponentListView: React.FC<ComponentListViewProps> = ({ applicationName }) => {
  const namespace = useNamespace();
  const [routes, loaded] = useApplicationRoutes(applicationName);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [statusFiltersParam, setStatusFiltersParam] = useSearchParam('status', '');
  const [mergeAlertHidden, setMergeAlertHidden] = React.useState<boolean>(false);

  const [allComponents, componentsLoaded] = useComponents(namespace, applicationName);

  const components = React.useMemo(
    () =>
      componentsLoaded ? allComponents?.filter((c) => c.spec.application === applicationName) : [],
    [allComponents, applicationName, componentsLoaded],
  );

  const [pipelineRuns, pipelineRunsLoaded] = useK8sWatchResource<PipelineRunKind[]>({
    groupVersionKind: PipelineRunGroupVersionKind,
    isList: true,
    namespace,
    selector: {
      matchLabels: {
        [PipelineRunLabel.APPLICATION]: applicationName,
      },
    },
  });

  const [gitOpsDeployment, gitOpsDeploymentLoaded] = useGitOpsDeploymentCR(
    applicationName,
    namespace,
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

  const filteredComponents = React.useMemo(
    () =>
      components.filter((component) => {
        const compStatus = statusFilters?.length
          ? getStatusFilterIdForComponent(component, pipelineRuns)
          : '';
        const unMerged = !pipelineRuns?.find(
          ({ metadata: { labels } }) =>
            labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name,
        );
        return (
          (!nameFilter || component.metadata.name.indexOf(nameFilter) !== -1) &&
          (!statusFilters?.length ||
            statusFilters.includes(compStatus) ||
            (unMerged && statusFilters.includes(NEEDS_MERGE_FILTER_ID)))
        );
      }),
    [components, statusFilters, pipelineRuns, nameFilter],
  );

  const title = React.useMemo(() => {
    const allMerged = components.every(
      (component) =>
        !isPACEnabled(component) ||
        pipelineRuns.find(
          ({ metadata: { labels } }) =>
            labels?.[PipelineRunLabel.COMPONENT] === component.metadata.name,
        ),
    );
    return (
      <>
        <Title headingLevel="h3" className="pf-u-mt-lg pf-u-mb-sm">
          Components
        </Title>
        <TextContent>
          <Text component={TextVariants.p}>
            A component is an image built from source code in a repository. One or more components
            that run together form an application.
          </Text>
        </TextContent>
        {!allMerged && !mergeAlertHidden ? (
          <Alert
            className="pf-u-mt-md"
            variant={AlertVariant.warning}
            isInline
            title="Merge pull requests of a build pipeline to your source code"
            actionClose={<AlertActionCloseButton onClose={() => setMergeAlertHidden(true)} />}
            actionLinks={
              <AlertActionLink
                onClick={() => window.open(getURLForComponentPRs(components), '_blank')}
              >
                View all pull requests
              </AlertActionLink>
            }
            data-testid="components-unmerged-build-pr"
          >
            <p>
              In order to trigger your builds, merge the build pipeline pull request we have sent
              for you.
            </p>
          </Alert>
        ) : null}
      </>
    );
  }, [components, mergeAlertHidden, pipelineRuns]);

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
              {title}
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
                      data-test="name-input-filter"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={setNameFilter}
                      value={nameFilter}
                      onClear={() => setNameFilter('')}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="secondary"
                      component={(p) => (
                        <Link
                          {...p}
                          data-test="add-component-button"
                          to={`/stonesoup/import?application=${applicationName}`}
                        />
                      )}
                    >
                      Add component
                    </Button>
                  </ToolbarItem>
                  <ToolbarGroup alignment={{ default: 'alignRight' }}>
                    {gitOpsDeploymentLoaded ? (
                      gitOpsDeployment ? (
                        <ToolbarItem>
                          Deployment strategy:{' '}
                          <Label>{getGitOpsDeploymentStrategy(gitOpsDeployment)}</Label>
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
                    {filteredComponents?.map((component) => (
                      <ComponentListItem
                        key={component.metadata.uid}
                        component={component}
                        routes={routes}
                        allComponents={components}
                      />
                    ))}
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
              <Button
                variant="primary"
                component={(props) => (
                  <Link {...props} to={`/stonesoup/import?application=${applicationName}`} />
                )}
              >
                Add component
              </Button>
            </AppEmptyState>
          )}
        </>
      )}
    </>
  );
};

export default ComponentListView;
