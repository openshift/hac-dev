import * as React from 'react';
import { Link } from 'react-router-dom';
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
import { useSortedEnvironments } from '../../hooks/useEnvironments';
import { useSearchParam } from '../../hooks/useSearchParam';
import { EnvironmentKind } from '../../types';
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
  preFilter?: (environment: EnvironmentKind) => boolean;
  filter?: (environment: EnvironmentKind) => boolean;
  renderToolbarGroups?: (environments: EnvironmentKind[]) => React.ReactNode;
  CardComponent?: React.ComponentType<{ environment: EnvironmentKind }>;
  onClearAllFilters?: () => void;
  emptyStateContent?: React.ReactNode;
};

const EnvironmentListView: React.FC<Props> = ({
  preFilter,
  renderToolbarGroups,
  filter,
  CardComponent = EnvironmentCard,
  onClearAllFilters,
  emptyStateContent,
}) => {
  const [nameFilter, setNameFilter, unsetNameFilter] = useSearchParam('name', '');
  const [allEnvironments, loaded] = useSortedEnvironments();

  const environments = React.useMemo(
    () => (preFilter ? allEnvironments.filter(preFilter) : allEnvironments),
    [preFilter, allEnvironments],
  );

  const filteredEnvironments = React.useMemo(() => {
    // apply name filter
    let result = nameFilter
      ? environments.filter(({ metadata: { name } }) => name.indexOf(nameFilter) !== -1)
      : environments;

    // apply filter if present
    result = filter ? result.filter(filter) : result;

    return result;
  }, [environments, filter, nameFilter]);

  if (!loaded) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  const createEnvironmentButton = (
    <Button
      variant="secondary"
      component={(props) => (
        <Link {...props} to="/app-studio/workspace-settings/environment/create" />
      )}
    >
      Create environment
    </Button>
  );

  const createEnvironment = (
    <Toolbar
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={onClearAllFilters}
      clearFiltersButtonText="Clear filters"
    >
      <ToolbarContent className="pf-u-pl-0">
        {environments.length > 0 ? (
          <>
            {renderToolbarGroups ? renderToolbarGroups(environments) : null}
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
  );

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
          {createEnvironmentButton}
        </EmptyState>
      ) : filteredEnvironments.length === 0 ? (
        <>
          {createEnvironment}
          <FilteredEmptyState
            onClearFilters={() => {
              unsetNameFilter();
              onClearAllFilters?.();
            }}
          />
        </>
      ) : (
        <>
          {createEnvironment}
          <Grid hasGutter>
            {filteredEnvironments.map((env) => (
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
        </>
      )}
    </>
  );
};

export default EnvironmentListView;
