import * as React from 'react';
import {
  PageSection,
  PageSectionVariants,
  SearchInput,
  Text,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { Table } from '../../../shared';
import FilteredEmptyState from '../../../shared/components/empty-state/FilteredEmptyState';
import SnapshotComponentsEmptyState from './SnapshotComponentsEmptyState';
import SnapshotComponentsListHeader from './SnapshotComponentsListHeader';
import SnapshotComponentsListRow, { SnapshotComponentTableData } from './SnapshotComponentsListRow';

interface SnapshotComponentsListProps {
  applicationName?: string;
  components: SnapshotComponentTableData[];
}

const SnapshotComponentsList: React.FC<React.PropsWithChildren<SnapshotComponentsListProps>> = ({
  applicationName,
  components,
}) => {
  const [nameFilter, setNameFilter] = useSearchParam('name', '');

  const filteredComponents = React.useMemo(
    () =>
      components.filter(
        (component) => !nameFilter || component.metadata?.name.indexOf(nameFilter.trim()) !== -1,
      ),
    [nameFilter, components],
  );

  const onClearFilters = () => setNameFilter('');
  const onNameInput = (name: string) => setNameFilter(name);

  return (
    <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
      <>
        <Title size="lg" headingLevel="h2" className="pf-c-title pf-u-mt-lg pf-u-mb-sm">
          Components
        </Title>
        {!components || components.length === 0 ? (
          <SnapshotComponentsEmptyState applicationName={applicationName} />
        ) : (
          <>
            <Text className="pf-u-mb-lg">Component builds that are included in this snapshot</Text>

            <Toolbar data-test="component-list-toolbar" clearAllFilters={onClearFilters}>
              <ToolbarContent>
                <ToolbarGroup align={{ default: 'alignLeft' }}>
                  <ToolbarItem className="pf-u-ml-0">
                    <SearchInput
                      name="nameInput"
                      data-test="name-input-filter"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={(e, name) => onNameInput(name)}
                      value={nameFilter}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            {filteredComponents.length > 0 ? (
              <Table
                data={filteredComponents}
                aria-label="Component List"
                Header={SnapshotComponentsListHeader}
                Row={SnapshotComponentsListRow}
                loaded
                getRowProps={(obj) => ({
                  id: obj.sha,
                })}
              />
            ) : (
              <FilteredEmptyState onClearFilters={onClearFilters} />
            )}
          </>
        )}
      </>
    </PageSection>
  );
};

export default SnapshotComponentsList;
