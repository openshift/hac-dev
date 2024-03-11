import * as React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FieldArray, useField } from 'formik';
import { debounce } from 'lodash-es';
import { useModalLauncher } from '../../../../../components/modal/ModalProvider';
import { useSearchParam } from '../../../../../hooks/useSearchParam';
import ActionMenu from '../../../../../shared/components/action-menu/ActionMenu';
import FilteredEmptyState from '../../../../../shared/components/empty-state/FilteredEmptyState';
import { createAddBugModal } from './AddBugModal';

interface AddBugSectionProps {
  field: string;
}

export interface BugsObject {
  issueKey: string;
  summary: string;
  url?: string;
  last_updated?: string;
  status?: string;
}

const AddBugSection: React.FC<React.PropsWithChildren<AddBugSectionProps>> = ({ field }) => {
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [{ value: issues }, ,] = useField<BugsObject[]>(field);
  const showModal = useModalLauncher();

  const [onLoadName, setOnLoadName] = React.useState(nameFilter);
  React.useEffect(() => {
    if (nameFilter) {
      setOnLoadName(nameFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBugs = issues?.filter(
    (bug) => !nameFilter || bug.issueKey.indexOf(nameFilter) >= 0,
  );

  const onClearFilters = () => {
    onLoadName.length && setOnLoadName('');
    setNameFilter('');
  };
  const onNameInput = debounce((n: string) => {
    n.length === 0 && onLoadName.length && setOnLoadName('');

    setNameFilter(n);
  }, 600);

  const EmptyMsg = () =>
    nameFilter ? (
      <FilteredEmptyState onClearFilters={onClearFilters} />
    ) : (
      <EmptyState>
        <EmptyStateBody>No Bugs found</EmptyStateBody>
      </EmptyState>
    );

  return (
    <FieldArray
      name="issues"
      render={(arrayHelper) => {
        const addNewBug = (bug) => {
          arrayHelper.push(bug);
        };

        return (
          <>
            <Toolbar
              data-test="pipelinerun-list-toolbar"
              clearAllFilters={onClearFilters}
              className="pf-v5-u-mb-0 pf-v5-u-pb-0 pf-v5-u-pl-0"
            >
              <ToolbarContent>
                <ToolbarGroup align={{ default: 'alignLeft' }}>
                  <ToolbarItem className="pf-v5-u-ml-0">
                    <SearchInput
                      name="nameInput"
                      data-test="name-input-filter"
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={(e, n) => onNameInput(n)}
                      value={nameFilter}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      onClick={() => showModal(createAddBugModal({ bugArrayHelper: addNewBug }))}
                      data-test="edit-param-button"
                    >
                      Add a Bug
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
            <Table
              aria-label="Simple table"
              variant="compact"
              borders
              className="pf-v5-u-mt-0 pf-v5-u-pt-0"
            >
              <Thead>
                <Tr>
                  <Th>Bug issue key</Th>
                  <Th>URL</Th>
                  <Th>Summary</Th>
                  <Th>Last updated</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(filteredBugs) && filteredBugs.length > 0
                  ? filteredBugs.map((bug, i) => (
                      <Tr key={bug.issueKey}>
                        <Td>{bug.issueKey}</Td>
                        <Td>{bug.url}</Td>
                        <Td>{bug.summary}</Td>
                        <Td>{bug.last_updated}</Td>
                        <Td>{bug.status}</Td>
                        <Td>
                          <ActionMenu
                            actions={[
                              {
                                cta: () => arrayHelper.remove(i),
                                id: 'delete-bug',
                                label: 'Delete bug',
                              },
                            ]}
                          />
                        </Td>
                      </Tr>
                    ))
                  : EmptyMsg()}
              </Tbody>
            </Table>
          </>
        );
      }}
    />
  );
};

export default AddBugSection;
