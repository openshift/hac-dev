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
import { useReleasePlans } from '../../../hooks/useReleasePlans';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { ReleasePlanModel } from '../../../models';
import { Table } from '../../../shared';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { withPageAccessCheck } from '../../PageAccess/withPageAccessCheck';
import { ReleaseServiceEmptyState } from '../ReleaseServiceEmptyState';
import ReleasePlanListHeader from './ReleasePlanListHeader';
import ReleasePlanListRow from './ReleasePlanListRow';

const ReleasePlanListView: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { namespace } = useWorkspaceInfo();
  const [releasePlans, loaded] = useReleasePlans(namespace);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const onClearFilters = () => setNameFilter('');

  const filteredReleasePlans = React.useMemo(
    () => releasePlans.filter((r) => r.metadata.name.indexOf(nameFilter) !== -1),
    [releasePlans, nameFilter],
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!releasePlans?.length) {
    return <ReleaseServiceEmptyState title="No Release Plan found" />;
  }

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Helmet>
        <title>Release Plan | {FULL_APPLICATION_TITLE}</title>
      </Helmet>
      <Toolbar data-testid="release-plan-list-toolbar" clearAllFilters={onClearFilters}>
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
      {!filteredReleasePlans?.length ? (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      ) : (
        <Table
          data-test="release-plan__table"
          data={filteredReleasePlans}
          aria-label="Release List"
          Header={ReleasePlanListHeader}
          Row={ReleasePlanListRow}
          loaded
          getRowProps={(obj) => ({
            id: obj.sha,
          })}
        />
      )}
    </PageSection>
  );
};

export default withPageAccessCheck(ReleasePlanListView)({
  accessReviewResources: [
    { model: ReleasePlanModel, verb: 'patch' },
    { model: ReleasePlanModel, verb: 'create' },
  ],
});
