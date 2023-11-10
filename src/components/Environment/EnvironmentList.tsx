import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  EmptyStateBody,
  Grid,
  GridItem,
  Spinner,
  PageSection,
  PageSectionVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
} from '@patternfly/react-core';
import { useSearchParam } from '../../hooks/useSearchParam';
import emptyStateImgUrl from '../../imgs/Environment.svg';
import { EnvironmentModel } from '../../models';
import AppEmptyState from '../../shared/components/empty-state/AppEmptyState';
import FilteredEmptyState from '../../shared/components/empty-state/FilteredEmptyState';
import { EnvironmentKind } from '../../types';
import { sortEnvironmentsBasedonParent } from '../../utils/environment-utils';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import EnvironmentCard from './EnvironmentCard';

import './EnvironmentList.scss';

type EnvironmentListProps = {
  environments: EnvironmentKind[];
  environmentsLoaded: boolean;
  filter?: (environment: EnvironmentKind) => boolean;
  ToolbarGroups?: React.ReactNode;
  onClearAllFilters?: () => void;
  readOnly?: boolean;
  applicationName?: string;
};

const EnvironmentList: React.FC<React.PropsWithChildren<EnvironmentListProps>> = ({
  environments,
  environmentsLoaded,
  ToolbarGroups = null,
  filter,
  onClearAllFilters,
  readOnly = false,
  applicationName,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [nameFilter, setNameFilter, unsetNameFilter] = useSearchParam('name', '');
  const [canCreateEnvironment] = useAccessReviewForModel(EnvironmentModel, 'create');

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
    return (
      <ButtonWithAccessTooltip
        component={(props) => (
          <Link
            {...props}
            to={`/application-pipeline/environments/workspaces/${workspace}/create`}
          />
        )}
        isDisabled={!canCreateEnvironment}
        tooltip="You don't have access to create an environment"
        analytics={{
          link_name: 'create-environment',
          workspace,
        }}
      >
        Create environment
      </ButtonWithAccessTooltip>
    );
  }, [canCreateEnvironment, workspace]);

  const emptyState = (
    <AppEmptyState emptyStateImg={emptyStateImgUrl} title="Manage your deployments">
      <EmptyStateBody>
        An environment is a set of compute resources that you can use to develop, test, and stage
        your applications.
        <br />
        To get started, create an environment.
      </EmptyStateBody>
      {!readOnly && <div className="pf-v5-u-mt-xl">{createEnvironmentButton}</div>}
    </AppEmptyState>
  );

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

  if (environments.length === 0) return emptyState;

  return (
    <>
      <Toolbar
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={onClearAllFilters}
        clearFiltersButtonText="Clear filters"
      >
        <ToolbarContent className="pf-v5-u-pl-0">
          {environments.length > 0 ? (
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
          {!readOnly && <ToolbarItem>{createEnvironmentButton}</ToolbarItem>}
        </ToolbarContent>
      </Toolbar>
      {filteredEnvironments.length === 0 ? (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      ) : (
        <Grid hasGutter>
          {filteredEnvironments.map((env) => (
            <GridItem
              span={12}
              md={6}
              lg={3}
              key={env.metadata.name}
              data-test="environment-card"
              className="environment-list_card"
            >
              <EnvironmentCard
                environment={env}
                readOnly={readOnly}
                applicationName={applicationName}
              />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
};

export default EnvironmentList;
