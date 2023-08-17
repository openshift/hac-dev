import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  EmptyStateBody,
  SearchInput,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { useRemoteSecrets } from '../../../hooks/UseRemoteSecrets';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { RemoteSecretModel } from '../../../models';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../../ButtonWithAccessTooltip';
import AppEmptyState from '../../EmptyState/AppEmptyState';
import FilteredEmptyState from '../../EmptyState/FilteredEmptyState';
import SecretsList from './SecretsList';

type SecretsListViewProps = {
  readOnly?: boolean;
};

const SecretsListView: React.FC<SecretsListViewProps> = ({ readOnly = false }) => {
  const { namespace, workspace } = useWorkspaceInfo();

  const [secrets, secretsLoaded] = useRemoteSecrets(namespace);
  const [nameFilter, setNameFilter, unsetNameFilter] = useSearchParam('name', '');
  const [canCreateRemoteSecret] = useAccessReviewForModel(RemoteSecretModel, 'create');

  const filteredRemoteSecrets = React.useMemo(() => {
    // apply name filter
    return nameFilter
      ? secrets.filter((s) => (s.spec?.secret?.name || s.metadata.name).indexOf(nameFilter) !== -1)
      : secrets;
  }, [secrets, nameFilter]);

  const createSecretButton = React.useMemo(() => {
    return (
      <ButtonWithAccessTooltip
        component={(props) => (
          <Link {...props} to={`/application-pipeline/secrets/workspaces/${workspace}/create`} />
        )}
        isDisabled={!canCreateRemoteSecret}
        tooltip="You don't have access to create a secret"
        analytics={{
          link_name: 'create-secret',
          workspace,
        }}
      >
        Create secret
      </ButtonWithAccessTooltip>
    );
  }, [canCreateRemoteSecret, workspace]);
  /**Todo: Update emptystateImage once it is available */
  const emptyState = (
    <AppEmptyState
      emptyStateImg={null}
      title="Manage your secrets"
      data-testid="secrets-empty-state"
    >
      <EmptyStateBody>
        <br />
        To get started, create a secret.
      </EmptyStateBody>
      {!readOnly && <div className="pf-u-mt-xl">{createSecretButton}</div>}
    </AppEmptyState>
  );

  const onClearFilters = React.useCallback(() => {
    unsetNameFilter();
  }, [unsetNameFilter]);

  if (!secretsLoaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }
  if (secrets.length === 0) return emptyState;

  return (
    <>
      <Toolbar collapseListedFiltersBreakpoint="xl" clearFiltersButtonText="Clear filters">
        <ToolbarContent className="pf-u-pl-0">
          {secrets.length > 0 ? (
            <>
              <ToolbarItem>
                <SearchInput
                  name="nameInput"
                  data-test="env-name-filter-input"
                  type="search"
                  aria-label="name filter"
                  placeholder="Search secrets"
                  value={nameFilter}
                  onChange={(e, name) => setNameFilter(name)}
                />
              </ToolbarItem>
            </>
          ) : null}
          {!readOnly && <ToolbarItem>{createSecretButton}</ToolbarItem>}
        </ToolbarContent>
      </Toolbar>
      {filteredRemoteSecrets.length === 0 ? (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      ) : (
        <SecretsList secrets={filteredRemoteSecrets} />
      )}
    </>
  );
};
export default SecretsListView;
