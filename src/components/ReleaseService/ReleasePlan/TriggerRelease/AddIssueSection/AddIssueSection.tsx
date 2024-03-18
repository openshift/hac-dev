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
  EmptyStateVariant,
  Truncate,
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { FieldArray, useField } from 'formik';
import { debounce } from 'lodash-es';
import { useSearchParam } from '../../../../../hooks/useSearchParam';
import ActionMenu from '../../../../../shared/components/action-menu/ActionMenu';
import FilteredEmptyState from '../../../../../shared/components/empty-state/FilteredEmptyState';
import { AddIssueModal, IssueType } from './AddIssueModal';

import './AddIssueSection.scss';

interface AddIssueSectionProps {
  field: string;
  issueType: IssueType;
}

export interface IssueObject {
  key: string;
  summary: string;
  url?: string;
  components?: string[];
  uploadDate?: string;
  status?: string;
}

export const issueTableColumnClass = {
  issueKey: 'pf-m-width-15 wrap-column ',
  bugUrl: 'pf-m-width-20 ',
  cveUrl: 'pf-m-width-15 ',
  components: 'pf-m-width-15 ',
  summary: 'pf-m-width-20 pf-m-width-15-on-xl ',
  uploadDate: 'pf-m-width-15 pf-m-width-10-on-xl ',
  status: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-15 ',
  kebab: 'pf-v5-c-table__action',
};

export const AddIssueSection: React.FC<React.PropsWithChildren<AddIssueSectionProps>> = ({
  field,
  issueType,
}) => {
  const [nameFilter, setNameFilter] = useSearchParam(field, '');
  const [{ value: issues }, ,] = useField<IssueObject[]>(field);

  const isBug = issueType === IssueType.BUG;

  const [onLoadName, setOnLoadName] = React.useState(nameFilter);
  React.useEffect(() => {
    if (nameFilter) {
      setOnLoadName(nameFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredIssues = React.useMemo(
    () =>
      issues && Array.isArray(issues)
        ? issues?.filter(
            (bug) => !nameFilter || bug.key.toLowerCase().indexOf(nameFilter.toLowerCase()) >= 0,
          )
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

  const EmptyMsg = (type) =>
    nameFilter ? (
      <FilteredEmptyState onClearFilters={onClearFilters} variant={EmptyStateVariant.xs} />
    ) : (
      <EmptyState className="pf-v5-u-m-0 pf-v5-u-p-0" variant={EmptyStateVariant.xs}>
        <EmptyStateBody className="pf-v5-u-m-0 pf-v5-u-p-0">
          {type === IssueType.BUG ? 'No Bugs found' : 'No CVEs found'}
        </EmptyStateBody>
      </EmptyState>
    );

  return (
    <FieldArray
      name={field}
      render={(arrayHelper) => {
        const addNewBug = (bug) => {
          arrayHelper.push(bug);
        };

        return (
          <>
            <TextContent className="pf-v5-u-mt-xs">
              <Text component={TextVariants.h4} className="pf-v5-u-mt-0 pf-v5-u-pt-0">
                {isBug
                  ? 'Are there any bug fixes you would like to add to this release?'
                  : 'Are there any CVEs you would like to add to this release?'}
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
                      data-test={`${field}-input-filter`}
                      type="search"
                      aria-label="name filter"
                      placeholder="Filter by name..."
                      onChange={(e, n) => onNameInput(n)}
                      value={nameFilter}
                    />
                  </ToolbarItem>
                  <ToolbarItem>
                    <AddIssueModal bugArrayHelper={addNewBug} issueType={issueType} />
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
                {isBug ? (
                  <Thead>
                    <Tr>
                      <Th className={issueTableColumnClass.issueKey}>Bug issue key</Th>
                      <Th className={issueTableColumnClass.bugUrl}>URL</Th>
                      <Th className={issueTableColumnClass.summary}>Summary</Th>
                      <Th className={issueTableColumnClass.uploadDate}>Last updated</Th>
                      <Th className={issueTableColumnClass.status}>Status</Th>
                    </Tr>
                  </Thead>
                ) : (
                  <Thead>
                    <Tr>
                      <Th className={issueTableColumnClass.issueKey}>CVE key</Th>
                      <Th className={issueTableColumnClass.cveUrl}>URL</Th>
                      <Th className={issueTableColumnClass.components}>Components</Th>
                      <Th className={issueTableColumnClass.summary}>Summary</Th>
                      <Th className={issueTableColumnClass.uploadDate}>Last updated</Th>
                      <Th className={issueTableColumnClass.status}>Status</Th>
                    </Tr>
                  </Thead>
                )}

                {Array.isArray(filteredIssues) && filteredIssues.length > 0 && (
                  <Tbody data-test="issue-table-body">
                    {filteredIssues.map((issue, i) => (
                      <Tr key={issue.key}>
                        <Td className={issueTableColumnClass.issueKey} data-test="issue-key">
                          {issue.key ?? '-'}
                        </Td>
                        <Td
                          className={
                            isBug ? issueTableColumnClass.bugUrl : issueTableColumnClass.bugUrl
                          }
                          data-test="issue-url"
                        >
                          <Truncate content={issue.url} />
                        </Td>
                        {!isBug && (
                          <Td className={issueTableColumnClass.components}>
                            {issue.components &&
                            Array.isArray(issue.components) &&
                            issue.components.length > 0
                              ? issue.components?.map((component) => (
                                  <span key={component} className="pf-v5-u-mr-sm">
                                    {component}
                                  </span>
                                ))
                              : '-'}
                          </Td>
                        )}
                        <Td className={issueTableColumnClass.summary} data-test="issue-summary">
                          {issue.summary ? <Truncate content={issue.summary} /> : '-'}
                        </Td>
                        <Td
                          className={issueTableColumnClass.uploadDate}
                          data-test="issue-uploadDate"
                        >
                          {issue.uploadDate ?? '-'}
                        </Td>
                        <Td className={issueTableColumnClass.status} data-test="issue-status">
                          {issue.status ?? '-'}
                        </Td>
                        <Td className={issueTableColumnClass.kebab}>
                          <ActionMenu
                            actions={[
                              {
                                cta: () => arrayHelper.remove(i),
                                id: 'delete-bug',
                                label: isBug ? 'Delete bug' : 'Delete CVE',
                              },
                            ]}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                )}
              </Table>
              {!filteredIssues ||
                (filteredIssues?.length === 0 && (
                  <div className="add-issue-section__emptyMsg">{EmptyMsg(issueType)}</div>
                ))}
            </div>
          </>
        );
      }}
    />
  );
};
