import * as React from 'react';

export type TableDataProps = {
  className?: string;
  columnID?: string;
  columns?: Set<string>;
  id?: string;
};

export const TableData: React.FC<TableDataProps> = ({ className, ...props }) => (
  <td {...props} className={className} role="gridcell" />
);
