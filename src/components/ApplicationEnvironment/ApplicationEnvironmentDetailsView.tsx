import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  InputGroup,
  Label,
  PageSection,
  Panel,
  Spinner,
  StackItem,
  Tab,
  Tabs,
  TabTitleText,
  TextInput,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { FilterIcon, ListIcon, TopologyIcon } from '@patternfly/react-icons/dist/js/icons';
import { css } from '@patternfly/react-styles';
import viewStyles from '@patternfly/react-styles/css/components/Topology/topology-view';
import { useSearchParam } from '../../hooks/useSearchParam';
import { ComponentGroupVersionKind, EnvironmentGroupVersionKind } from '../../models';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { useApplicationEnvironmentStatus } from '../../shared/hooks/useApplicationEnvironmentStatus';
import { ComponentKind, EnvironmentKind } from '../../types';
import { getEnvironmentDeploymentStrategyLabel } from '../../utils/environment-utils';
import { useNamespace } from '../../utils/namespace-context-utils';
import ApplicationEnvironmentGraphView from './ApplicationEnvironmentGraphView';
import ApplicationEnvironmentListView from './ApplicationEnvironmentListView';
import ApplicationEnvironmentSidePanel from './ApplicationEnvironmentSidePanel';

import './ApplicationEnvironmentDetails.scss';

type ApplicationEnvironmentDetailsProps = {
  applicationName: string;
  environmentName: string;
};

const ApplicationEnvironmentDetailsEmptyState: React.FC<{ environmentName: string }> = ({
  environmentName,
}) => (
  <EmptyState variant={EmptyStateVariant.large} data-testid="env-details-empty-state">
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      No deployed components
    </Title>
    <EmptyStateBody>To get started, add some deploy components to your environment.</EmptyStateBody>
    <Button
      variant="primary"
      component={(props) => (
        <Link {...props} to={`/app-studio/import?environment=${environmentName}`} />
      )}
    >
      Deploy components
    </Button>
  </EmptyState>
);

export const ApplicationEnvironmentDetailsView: React.FC<ApplicationEnvironmentDetailsProps> = ({
  applicationName,
  environmentName,
}) => {
  const namespace = useNamespace();
  const [viewType, setViewType] = useSearchParam('view', 'list');
  const [nameFilter, setNameFilter] = React.useState<string>('');
  const [selectedId, setSelectedId] = useSearchParam('selected', null);

  const [environment, environmentLoaded, environmentError] = useK8sWatchResource<EnvironmentKind>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    name: environmentName,
  });
  const [components, componentsLoaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });
  const [healthStatus, healthStatusIcon, lastDeploy, statusLoaded] =
    useApplicationEnvironmentStatus(applicationName, environment?.metadata?.name);

  const filteredComponents = React.useMemo(() => {
    if (!componentsLoaded || !components?.length) {
      return [];
    }

    return components?.filter(
      (c) =>
        c.spec.application === applicationName &&
        (!nameFilter || c.metadata.name.indexOf(nameFilter) !== -1),
    );
  }, [components, applicationName, componentsLoaded, nameFilter]);

  const showGraphView = viewType === 'graph';

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  const selectedComponent = React.useMemo(() => {
    if (!components?.length) {
      return undefined;
    }
    return components.find((component) => component.metadata.uid === selectedId);
  }, [components, selectedId]);

  const onSelect = React.useCallback(
    (id: string) => {
      setSelectedId(id === selectedId ? null : id || null);
    },
    [selectedId, setSelectedId],
  );

  const loading = (
    <Bullseye className="pf-u-mt-md">
      <Spinner />
    </Bullseye>
  );

  if (environmentError || !environmentLoaded || !componentsLoaded) {
    return loading;
  }

  return (
    <PageSection isFilled className="application-environment-details__section">
      <Panel className="application-environment-details__panel">
        <Flex
          className="application-environment-details__header-info"
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
        >
          <Title headingLevel="h1" className="pf-u-mt-sm">
            {environment.spec.displayName} Deployment Details
          </Title>
          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
            {statusLoaded ? (
              <>
                <FlexItem className="application-environment-details__header-info-item">
                  {healthStatusIcon} Application{' '}
                  <span className="application-environment-details__health-status">
                    {healthStatus}
                  </span>
                </FlexItem>
                <FlexItem className="application-environment-details__header-info-item">
                  Deployment strategy:{' '}
                  <Label isCompact>{getEnvironmentDeploymentStrategyLabel(environment)}</Label>
                </FlexItem>
                {lastDeploy ? (
                  <FlexItem className="application-environment-details__header-info-item">
                    <Timestamp timestamp={lastDeploy} simple />
                  </FlexItem>
                ) : null}
              </>
            ) : (
              <FlexItem className="application-environment-details__header-info-item">
                <Spinner isSVG size="md" />
              </FlexItem>
            )}
          </Flex>
        </Flex>
        <Tabs activeKey={0}>
          <Tab eventKey={0} title={<TabTitleText>Deployed components</TabTitleText>}>
            {components.length === 0 ? (
              <ApplicationEnvironmentDetailsEmptyState
                environmentName={environment.metadata.name}
              />
            ) : (
              <>
                <Toolbar
                  data-testid="application-environment-details-toolbar"
                  className="application-environment-details__toolbar"
                  clearAllFilters={onClearFilters}
                >
                  <ToolbarContent>
                    <ToolbarGroup alignment={{ default: 'alignLeft' }}>
                      <ToolbarItem>
                        <InputGroup>
                          <Button variant="control">
                            <FilterIcon /> Name
                          </Button>
                          <TextInput
                            name="nameInput"
                            data-testid="name-input-filter"
                            type="search"
                            aria-label="name filter"
                            placeholder="Filter by name..."
                            onChange={(name) => onNameInput(name)}
                          />
                        </InputGroup>
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup alignment={{ default: 'alignRight' }}>
                      <ToolbarItem>
                        <ToggleGroup aria-label="select view type">
                          <Tooltip position="left" content="List view">
                            <ToggleGroupItem
                              icon={<ListIcon />}
                              aria-label="list view"
                              buttonId="application-environment-list-toggle"
                              isSelected={!showGraphView}
                              onChange={() => setViewType('list')}
                              data-testid="list-view-toggle"
                            />
                          </Tooltip>
                          <Tooltip position="left" content="Graph view">
                            <ToggleGroupItem
                              icon={<TopologyIcon />}
                              aria-label="graph view"
                              buttonId="application-environment-graph-toggle"
                              isSelected={showGraphView}
                              onChange={() => setViewType('graph')}
                              data-testid="graph-view-toggle"
                            />
                          </Tooltip>
                        </ToggleGroup>
                      </ToolbarItem>
                    </ToolbarGroup>
                  </ToolbarContent>
                </Toolbar>
                <StackItem isFilled className={css(viewStyles.topologyContainer)}>
                  <Drawer isExpanded={!!selectedComponent} isInline>
                    <DrawerContent
                      panelContent={
                        <DrawerPanelContent isResizable id="topology-resize-panel">
                          {selectedComponent && (
                            <ApplicationEnvironmentSidePanel
                              component={selectedComponent}
                              onClose={() => setSelectedId(null)}
                            />
                          )}
                        </DrawerPanelContent>
                      }
                    >
                      <DrawerContentBody>
                        {componentsLoaded ? (
                          showGraphView ? (
                            <ApplicationEnvironmentGraphView
                              components={filteredComponents}
                              selectedId={selectedId}
                              onSelect={onSelect}
                            />
                          ) : (
                            <ApplicationEnvironmentListView
                              components={filteredComponents}
                              selectedId={selectedId}
                              onSelect={onSelect}
                              applicationName={applicationName}
                            />
                          )
                        ) : (
                          loading
                        )}
                      </DrawerContentBody>
                    </DrawerContent>
                  </Drawer>
                </StackItem>
              </>
            )}
          </Tab>
        </Tabs>
      </Panel>
    </PageSection>
  );
};
