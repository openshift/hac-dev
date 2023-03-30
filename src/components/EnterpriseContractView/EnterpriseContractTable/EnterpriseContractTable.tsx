import * as React from 'react';
import { TableComposable, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { UIEnterpriseContractData } from '../types';
import { EnterpriseContractRow } from './EnterpriseContractRow';

type EnterpriseContractTableProps = {
  ecResult: UIEnterpriseContractData[];
};

export const EnterpriseContractTable: React.FC<EnterpriseContractTableProps> = ({ ecResult }) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  // Sort Table
  const getSortableECRowValues = React.useCallback((ec: UIEnterpriseContractData): string[] => {
    const { title, status, timestamp, component } = ec;
    return [undefined, title, status, timestamp, component];
  }, []);

  const sortedECResult = React.useMemo(() => {
    return ecResult
      ? ecResult.sort((a, b) => {
          const aValue = getSortableECRowValues(a)[activeSortIndex];
          const bValue = getSortableECRowValues(b)[activeSortIndex];
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            // String sort
            if (activeSortDirection === 'asc') {
              return (aValue as string).localeCompare(bValue as string);
            }
            return (bValue as string).localeCompare(aValue as string);
          }
        })
      : undefined;
  }, [activeSortDirection, activeSortIndex, ecResult, getSortableECRowValues]);

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });
  return sortedECResult ? (
    <TableComposable variant="compact">
      <Thead>
        <Tr>
          <Th width={10} />
          <Th width={30} sort={getSortParams(1)}>
            Rules
          </Th>
          <Th width={10} sort={getSortParams(2)}>
            Status
          </Th>
          <Th width={20}>Effective from</Th>
          <Th width={30} sort={getSortParams(4)}>
            Component
          </Th>
        </Tr>
      </Thead>
      {sortedECResult
        ? sortedECResult.map((rule, i) => {
            return <EnterpriseContractRow rowIndex={i} key={i} data={rule} />;
          })
        : null}
    </TableComposable>
  ) : null;
};
