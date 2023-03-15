import * as React from 'react';
import { Link } from 'react-router-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  Spinner,
  Title,
  PageSection,
  PageSectionVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons';
import { useSearchParam } from '../../hooks/useSearchParam';
import { EnvironmentKind } from '../../types';
import { sortEnvironmentsBasedonParent } from '../../utils/environment-utils';
import { MVP_FLAG } from '../../utils/flag-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import FilteredEmptyState from '../EmptyState/FilteredEmptyState';
import EnvironmentCard from './EnvironmentCard';

import './EnvironmentListView.scss';

type Props = {
  environments: EnvironmentKind[];
  environmentsLoaded: boolean;
  description?: React.ReactNode;
  filter?: (environment: EnvironmentKind) => boolean;
  ToolbarGroups?: React.ReactNode;
  CardComponent?: React.ComponentType<{ environment: EnvironmentKind }>;
  onClearAllFilters?: () => void;
  emptyStateContent?: React.ReactNode;
};

const EnvironmentListView: React.FC<Props> = ({
  environments,
  environmentsLoaded,
  description = null,
  ToolbarGroups = null,
  filter,
  CardComponent = EnvironmentCard,
  onClearAllFilters,
  emptyStateContent,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);
  const [nameFilter, setNameFilter, unsetNameFilter] = useSearchParam('name', '');
  const filteredEnvironments = React.useMemo(() => {
    // apply name filter
    let result = nameFilter
      ? environments.filter(({ metadata: { name } }) => name.indexOf(nameFilter) !== -1)
      : environments;

    // apply filter if present
    result = filter ? result.filter(filter) : result;

    return sortEnvironmentsBasedonParent(result);
  }, [environments, filter, nameFilter]);

  const createEnvironmentButton = React.useMemo(() => {
    if (mvpFeature) {
      return null;
    }

    return (
      <Button
        variant="secondary"
        component={(props) => (
          <Link
            {...props}
            to={`/stonesoup/workspaces/${workspace}/workspace-settings/environment/create`}
          />
        )}
      >
        Create environment
      </Button>
    );
  }, [mvpFeature, workspace]);

  const onClearFilters = React.useCallback(() => {
    unsetNameFilter();
    onClearAllFilters?.();
  }, [unsetNameFilter, onClearAllFilters]);

  if (!environmentsLoaded) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  return (
    <>
      {environments.length === 0 ? (
        emptyStateContent ?? (
          <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No Environments
            </Title>
            {!mvpFeature ? (
              <EmptyStateBody>To get started, create an environment.</EmptyStateBody>
            ) : null}
            {createEnvironmentButton ? (
              <div className="pf-u-mt-xl">{createEnvironmentButton}</div>
            ) : null}
          </EmptyState>
        )
      ) : (
        <>
          {description}
          <Toolbar
            collapseListedFiltersBreakpoint="xl"
            clearAllFilters={onClearAllFilters}
            clearFiltersButtonText="Clear filters"
          >
            <ToolbarContent className="pf-u-pl-0">
              {!mvpFeature && environments.length > 0 ? (
                <>
                  {ToolbarGroups}
                  <ToolbarItem>
                    <SearchInput
                      name="nameInput"
                      data-test="env-name-filter-input"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      value={nameFilter}
                      onChange={(e, name) => setNameFilter(name)}
                    />
                  </ToolbarItem>
                </>
              ) : null}
              <ToolbarItem>{createEnvironmentButton}</ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          {!mvpFeature && filteredEnvironments.length === 0 ? (
            <FilteredEmptyState onClearFilters={onClearFilters} />
          ) : (
            <Grid hasGutter>
              {mvpFeature
                ? filteredEnvironments.map((env) => (
                    <GridItem
                      span={12}
                      md={6}
                      lg={3}
                      key={env.metadata.name}
                      data-test="environment-card"
                      className="environment-list-view_card"
                    >
                      <CardComponent environment={env} />
                    </GridItem>
                  ))
                : filteredEnvironments.map((env) => (
                    <GridItem
                      span={12}
                      md={6}
                      lg={3}
                      key={env.metadata.name}
                      data-test="environment-card"
                      className="environment-list-view_card"
                    >
                      <CardComponent environment={env} />
                    </GridItem>
                  ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default EnvironmentListView;
