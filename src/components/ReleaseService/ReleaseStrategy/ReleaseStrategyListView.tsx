import * as React from 'react';
import { Helmet } from 'react-helmet';
import {
  Bullseye,
  Button,
  InputGroup,
  PageSection,
  PageSectionVariants,
  Spinner,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons';
import { FULL_APPLICATION_TITLE } from '../../../consts/labels';
import { useReleaseStrategies } from '../../../hooks/useReleaseStrategies';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { ReleaseStrategyModel } from '../../../models';
import { Table } from '../../../shared';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { withPageAccessCheck } from '../../PageAccess/withPageAccessCheck';
import { ReleaseServiceEmptyState } from '../ReleaseServiceEmptyState';
import ReleaseStrategyListHeader from './ReleaseStrategyListHeader';
import ReleaseStrategyListRow from './ReleaseStrategyListRow';

const ReleaseStrategyListView: React.FC = () => {
  const { namespace } = useWorkspaceInfo();
  const [releaseStrategies, loaded] = useReleaseStrategies(namespace);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const onClearFilters = () => setNameFilter('');

  const filteredReleaseStrategies = React.useMemo(
    () => releaseStrategies.filter((r) => r.metadata.name.indexOf(nameFilter) !== -1),
    [releaseStrategies, nameFilter],
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!releaseStrategies?.length) {
    return <ReleaseServiceEmptyState title="No Release Strategy found" />;
  }

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Helmet>
        <title>Release Strategy | {FULL_APPLICATION_TITLE}</title>
      </Helmet>
      <Toolbar data-testid="release-strategy-list-toolbar" clearAllFilters={onClearFilters}>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignLeft' }}>
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
                  onChange={(_, value: string) => setNameFilter(value)}
                  value={nameFilter}
                />
              </InputGroup>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      {!filteredReleaseStrategies?.length ? (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      ) : (
        <Table
          data-test="release-strategy__table"
          data={filteredReleaseStrategies}
          aria-label="Release Strategy List"
          Header={ReleaseStrategyListHeader}
          Row={ReleaseStrategyListRow}
          loaded
          getRowProps={(obj) => ({
            id: obj.sha,
          })}
        />
      )}
    </PageSection>
  );
};

export default withPageAccessCheck(ReleaseStrategyListView)({
  accessReviewResources: [
    { model: ReleaseStrategyModel, verb: 'patch' },
    { model: ReleaseStrategyModel, verb: 'create' },
  ],
});
