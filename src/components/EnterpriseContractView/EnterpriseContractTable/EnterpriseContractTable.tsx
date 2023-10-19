import * as React from 'react';
import { Table /* data-codemods */, Th, Thead, ThProps, Tr } from '@patternfly/react-table';
import { ENTERPRISE_CONTRACT_STATUS, UIEnterpriseContractData } from '../types';
import { EnterpriseContractRow } from './EnterpriseContractRow';

type EnterpriseContractTableProps = {
  ecResult: UIEnterpriseContractData[];
};

const STATUS_SORT_ORDER = [
  ENTERPRISE_CONTRACT_STATUS.violations,
  ENTERPRISE_CONTRACT_STATUS.warnings,
  ENTERPRISE_CONTRACT_STATUS.successes,
];
const COLUMN_ORDER = [undefined, 'title', 'status', 'msg', 'component'];

export const getSortColumnFuntion = (key: string, activeSortDirection: string) => {
  switch (key) {
    case 'status':
      return (a: UIEnterpriseContractData, b: UIEnterpriseContractData) => {
        const aValue = STATUS_SORT_ORDER.indexOf(a[key]);
        const bValue = STATUS_SORT_ORDER.indexOf(b[key]);
        if (aValue < bValue) {
          return activeSortDirection === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return activeSortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      };

    default:
      return (a: UIEnterpriseContractData, b: UIEnterpriseContractData) => {
        const aValue = a[key];
        const bValue = b[key];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // String sort
          if (activeSortDirection === 'asc') {
            return (aValue as string).localeCompare(bValue as string);
          }
          return (bValue as string).localeCompare(aValue as string);
        }
      };
  }
};

export const EnterpriseContractTable: React.FC<
  React.PropsWithChildren<EnterpriseContractTableProps>
> = ({ ecResult }) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(2);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(
    'asc',
  );

  const sortedECResult = React.useMemo(() => {
    return ecResult
      ? ecResult.sort(getSortColumnFuntion(COLUMN_ORDER[activeSortIndex], activeSortDirection))
      : undefined;
  }, [activeSortDirection, activeSortIndex, ecResult]);

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
    <Table variant="compact">
      <Thead>
        <Tr>
          <Th width={10} />
          <Th width={30} sort={getSortParams(1)}>
            Rules
          </Th>
          <Th width={10} sort={getSortParams(2)}>
            Status
          </Th>
          <Th width={30}>Message</Th>
          <Th width={20} sort={getSortParams(4)}>
            Component
          </Th>
        </Tr>
      </Thead>
      {sortedECResult
        ? sortedECResult.map((rule, i) => {
            return <EnterpriseContractRow rowIndex={i} key={i} data={rule} />;
          })
        : null}
    </Table>
  ) : null;
};
