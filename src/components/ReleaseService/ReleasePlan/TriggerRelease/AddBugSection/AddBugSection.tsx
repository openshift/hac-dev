import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  SearchInput,
  TextContent,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Text,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FieldArray, useField } from 'formik';
import { debounce } from 'lodash-es';
import { useSearchParam } from '../../../../../hooks/useSearchParam';
import ActionMenu from '../../../../../shared/components/action-menu/ActionMenu';
import FilteredEmptyState from '../../../../../shared/components/empty-state/FilteredEmptyState';
import { AddBugModal } from './AddBugModal';

import './AddBugSection.scss';

interface AddBugSectionProps {
  field: string;
}

export interface BugsObject {
  issueKey: string;
  summary: string;
  url?: string;
  uploadDate?: string;
  status?: string;
}

export const bugsTableColumnClass = {
  issueKey: 'pf-m-width-15 wrap-column',
  url: 'pf-m-width-30 pf-m-width-25-on-lg',
  summary: 'pf-m-width-20 pf-m-width-20-on-lg pf-m-width-15-on-xl',
  uploadDate: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-20',
  status: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-15',
  kebab: 'pf-v5-c-table__action',
};

const AddBugSection: React.FC<React.PropsWithChildren<AddBugSectionProps>> = ({ field }) => {
  const [nameFilter, setNameFilter] = useSearchParam('name', '');
  const [{ value: issues }, ,] = useField<BugsObject[]>(field);

  const [onLoadName, setOnLoadName] = React.useState(nameFilter);
  React.useEffect(() => {
    if (nameFilter) {
      setOnLoadName(nameFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBugs = React.useMemo(
    () =>
      issues && Array.isArray(issues)
        ? issues?.filter((bug) => !nameFilter || bug.issueKey.indexOf(nameFilter) >= 0)
        : [],
    [issues, nameFilter],
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
      <EmptyState className="pf-v5-u-m-0 pf-v5-u-p-">
        <EmptyStateBody className="pf-v5-u-m-0 pf-v5-u-p-0">No Bugs found</EmptyStateBody>
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
            <TextContent className="pf-v5-u-mt-xs">
              <Text component={TextVariants.h4} className="pf-v5-u-mt-0 pf-v5-u-pt-0">
                Are there any bug fixes you would like to add to this release?
              </Text>
            </TextContent>
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
                    <AddBugModal bugArrayHelper={addNewBug} />
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
            <div className="pf-v5-u-mb-md">
              <Table
                aria-label="Simple table"
                variant="compact"
                borders
                className="pf-v5-u-m-0 pf-v5-u-p-0"
              >
                <Thead>
                  <Tr>
                    <Th className={bugsTableColumnClass.issueKey}>Bug issue key</Th>
                    <Th className={bugsTableColumnClass.url}>URL</Th>
                    <Th className={bugsTableColumnClass.summary}>Summary</Th>
                    <Th className={bugsTableColumnClass.uploadDate}>Last updated</Th>
                    <Th className={bugsTableColumnClass.status}>Status</Th>
                  </Tr>
                </Thead>

                {Array.isArray(filteredBugs) && filteredBugs.length > 0 && (
                  <Tbody>
                    {filteredBugs.map((bug, i) => (
                      <Tr key={bug.issueKey}>
                        <Td className={bugsTableColumnClass.issueKey}>{bug.issueKey}</Td>
                        <Td className={bugsTableColumnClass.url}>{bug.url}</Td>
                        <Td className={bugsTableColumnClass.summary}>{bug.summary}</Td>
                        <Td className={bugsTableColumnClass.uploadDate}>{bug.uploadDate}</Td>
                        <Td className={bugsTableColumnClass.status}>{bug.status}</Td>
                        <Td className={bugsTableColumnClass.kebab}>
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
                    ))}
                  </Tbody>
                )}
              </Table>
            </div>
            {!filteredBugs ||
              (filteredBugs?.length === 0 && (
                <div className="add-bug-section__emptyMsg">{EmptyMsg()}</div>
              ))}
          </>
        );
      }}
    />
  );
};

export default AddBugSection;
