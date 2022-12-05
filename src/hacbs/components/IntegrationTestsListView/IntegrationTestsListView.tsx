import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  InputGroup,
  Spinner,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { CodeBranchIcon } from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { Table } from '../../../shared';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { IntegrationTestScenarioGroupVersionKind } from '../../models';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import { IntegrationTestListHeader } from './IntegrationTestListHeader';
import IntegrationTestListRow from './IntegrationTestListRow';

type IntegrationTestsListViewProps = {
  applicationName: string;
};

const IntegrationTestsEmptyState: React.FC<{ handleAddTest: () => void }> = ({ handleAddTest }) => (
  <EmptyState data-test="integration-tests__empty">
    <EmptyStateIcon icon={CodeBranchIcon} />
    <Title headingLevel="h4" size="lg">
      Add an integration test to test all your components after you commit code
    </Title>
    <EmptyStateBody>
      No integration tests found yet.
      <br />
      To get started, create an environment or connect to a release environment.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button
        variant={ButtonVariant.primary}
        onClick={handleAddTest}
        data-test="add-integration-test"
      >
        Add integration test
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

const IntegrationTestsFilteredState: React.FC<{ onClearFilters: () => void }> = ({
  onClearFilters,
}) => (
  <EmptyState data-test="integration-tests__all-filtered">
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No results match the filter criteria. Remove filters or clear all filters to show results.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link" onClick={onClearFilters} data-test="integration-tests__clear-filters">
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);
const IntegrationTestsListView: React.FC<IntegrationTestsListViewProps> = ({ applicationName }) => {
  const namespace = useNamespace();
  const navigate = useNavigate();
  const [integrationTests, integrationTestsLoaded] = useK8sWatchResource<
    IntegrationTestScenarioKind[]
  >({
    groupVersionKind: IntegrationTestScenarioGroupVersionKind,
    namespace,
    isList: true,
  });
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const applicationIntegrationTests = React.useMemo(
    () =>
      integrationTestsLoaded
        ? integrationTests?.filter((test) => test.spec.application === applicationName)
        : [],
    [integrationTests, applicationName, integrationTestsLoaded],
  );

  const filteredIntegrationTests = React.useMemo(
    () =>
      nameFilter
        ? applicationIntegrationTests.filter(
            (test) => test.metadata.name.indexOf(nameFilter) !== -1,
          )
        : applicationIntegrationTests,
    [nameFilter, applicationIntegrationTests],
  );

  const handleAddTest = React.useCallback(() => {
    navigate(`/stonesoup/applications/${applicationName}/integration-test`);
  }, [navigate, applicationName]);

  const loading = (
    <Bullseye className="pf-u-mt-md" data-test="integration-tests__loading">
      <Spinner />
    </Bullseye>
  );

  if (!integrationTestsLoaded) {
    return loading;
  }

  if (!applicationIntegrationTests?.length) {
    return <IntegrationTestsEmptyState handleAddTest={handleAddTest} />;
  }
  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  return (
    <>
      <Title headingLevel="h3" className="pf-u-mt-lg pf-u-mb-sm">
        Integration tests
      </Title>
      <TextContent>
        <Text component={TextVariants.p}>
          Add an integration test to test all your components after you commit code.
        </Text>
      </TextContent>
      <>
        <Toolbar data-testid="component-list-toolbar" clearAllFilters={onClearFilters}>
          <ToolbarContent>
            <ToolbarGroup alignment={{ default: 'alignLeft' }}>
              <ToolbarItem>
                <InputGroup>
                  <Button variant="control">
                    <FilterIcon /> Name
                  </Button>
                  <TextInput
                    name="nameInput"
                    data-test="name-input-filter"
                    type="search"
                    aria-label="name filter"
                    placeholder="Filter by name..."
                    onChange={(name) => onNameInput(name)}
                    value={nameFilter}
                  />
                </InputGroup>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
        {filteredIntegrationTests.length ? (
          <Table
            data-test="integration-tests__table"
            data={filteredIntegrationTests}
            aria-label="Integration tests"
            Header={IntegrationTestListHeader}
            Row={IntegrationTestListRow}
            loaded
            getRowProps={(obj: IntegrationTestScenarioKind) => ({
              id: obj.metadata.name,
            })}
          />
        ) : (
          <IntegrationTestsFilteredState onClearFilters={onClearFilters} />
        )}
      </>
    </>
  );
};

export default IntegrationTestsListView;
