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
  EmptyStateSecondaryActions,
  SearchInput,
} from '@patternfly/react-core';
import { CubesIcon, SearchIcon } from '@patternfly/react-icons/dist/esm/icons';
import { useSearchParam } from '../../hooks/useSearchParam';
import { EnvironmentKind } from '../../types';
import { MVP_FLAG } from '../../utils/flag-utils';
import EnvironmentCard from './EnvironmentCard';

import './EnvironmentListView.scss';

const FilteredEmptyState: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
  <EmptyState>
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No results match the filter criteria. Remove filters or clear all filters to show results.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

export type ToolbarGroupsProps = {
  environments: EnvironmentKind[];
};

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
  const [mvpFeature] = useFeatureFlag(MVP_FLAG);
  const [nameFilter, setNameFilter, unsetNameFilter] = useSearchParam('name', '');
  const filteredEnvironments = React.useMemo(() => {
    // apply name filter
    let result = nameFilter
      ? environments.filter(({ metadata: { name } }) => name.indexOf(nameFilter) !== -1)
      : environments;

    // apply filter if present
    result = filter ? result.filter(filter) : result;

    return result;
  }, [environments, filter, nameFilter]);

  const createEnvironmentButton = React.useMemo(
    () => (
      <Button
        variant="secondary"
        component={(props) => (
          <Link {...props} to="/stonesoup/workspace-settings/environment/create" />
        )}
      >
        Create environment
      </Button>
    ),
    [],
  );

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
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={CubesIcon} />
          {emptyStateContent ?? (
            <>
              <Title headingLevel="h4" size="lg">
                No Environments
              </Title>
              <EmptyStateBody>To get started, create an environment.</EmptyStateBody>
            </>
          )}
          <div className="pf-u-mt-xl">{createEnvironmentButton}</div>
        </EmptyState>
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
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      value={nameFilter}
                      onChange={(name) => setNameFilter(name)}
                    />
                  </ToolbarItem>
                </>
              ) : null}
              <ToolbarItem>{createEnvironmentButton}</ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          {!mvpFeature && filteredEnvironments.length === 0 ? (
            <FilteredEmptyState
              onClearFilters={() => {
                unsetNameFilter();
                onClearAllFilters?.();
              }}
            />
          ) : (
            <Grid hasGutter>
              {mvpFeature
                ? environments.map((env) => (
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
