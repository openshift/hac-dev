import * as React from 'react';
import { Tr } from '@patternfly/react-table';

export type TableRowProps = {
  id: React.ReactText;
  index: number;
  title?: string;
  trKey: string;
  style: object;
  className?: string;
};

export const TableRow: React.FC<React.PropsWithChildren<TableRowProps>> = ({
  id,
  index,
  trKey,
  style,
  className,
  ...props
}) => {
  return (
    <Tr
      {...props}
      data-id={id}
      data-index={index}
      data-test-rows="resource-row"
      data-test={id}
      data-key={trKey}
      style={style}
      className={className}
      role="row"
    />
  );
};
