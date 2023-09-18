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
import { useReleasePlanAdmissions } from '../../../hooks/useReleasePlanAdmissions';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { ReleasePlanAdmissionModel } from '../../../models/release-plan-admission';
import { Table } from '../../../shared';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { withPageAccessCheck } from '../../PageAccess/withPageAccessCheck';
import { ReleaseServiceEmptyState } from '../ReleaseServiceEmptyState';
import ReleasePlanListHeader from './ReleasePlanAdmissionListHeader';
import ReleasePlanListRow from './ReleasePlanAdmissionListRow';

const ReleasePlanAdmissionListView: React.FC = () => {
  const { namespace } = useWorkspaceInfo();
  const [releasePlanAdmission, loaded] = useReleasePlanAdmissions(namespace);
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const onClearFilters = () => setNameFilter('');

  const filteredReleasePlanAdmission = React.useMemo(
    () => releasePlanAdmission.filter((r) => r.metadata.name.indexOf(nameFilter) !== -1),
    [releasePlanAdmission, nameFilter],
  );

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!releasePlanAdmission?.length) {
    return <ReleaseServiceEmptyState title="No Release Plan Admission found" />;
  }

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <Helmet>
        <title>Release Plan | {FULL_APPLICATION_TITLE}</title>
      </Helmet>
      <Toolbar data-testid="release-plan-admission-list-toolbar" clearAllFilters={onClearFilters}>
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
      {!filteredReleasePlanAdmission?.length ? (
        <FilteredEmptyState onClearFilters={onClearFilters} />
      ) : (
        <Table
          data-test="release-plan-admission__table"
          data={filteredReleasePlanAdmission}
          aria-label="Release Plan Admission List"
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

export default withPageAccessCheck(ReleasePlanAdmissionListView)({
  accessReviewResources: [
    { model: ReleasePlanAdmissionModel, verb: 'patch' },
    { model: ReleasePlanAdmissionModel, verb: 'create' },
  ],
});
