import * as React from 'react';
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { VirtualTableBody } from '@patternfly/react-virtualized-extension';
import { Scroll } from '@patternfly/react-virtualized-extension/dist/js/components/Virtualized/types';
import { TableRow, TableRowProps } from './TableRow';

export type VirtualBodyProps<D = any, C = any> = {
  customData?: C;
  Row: React.FC<RowFunctionArgs>;
  height: number;
  isScrolling: boolean;
  onChildScroll: (params: Scroll) => void;
  data: D[];
  columns: any[];
  scrollTop: number;
  width: number;
  expand: boolean;
  getRowProps?: (obj: D) => Partial<Pick<TableRowProps, 'id' | 'className' | 'title'>>;
  onRowsRendered?: (params: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    startIndex: number;
    stopIndex: number;
  }) => void;
};

export type RowFunctionArgs<T = any, C = any> = {
  obj: T;
  columns: any[];
  customData?: C;
};

const RowMemo = React.memo<RowFunctionArgs & { Row: React.FC<RowFunctionArgs> }>(
  ({ Row, ...props }) => <Row {...props} />,
);

export const VirtualBody: React.FC<VirtualBodyProps> = (props) => {
  const {
    customData,
    Row,
    height,
    isScrolling,
    onChildScroll,
    data,
    columns,
    scrollTop,
    width,
    getRowProps,
    onRowsRendered,
  } = props;

  const cellMeasurementCache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 44,
    keyMapper: (rowIndex) => props?.data?.[rowIndex]?.metadata?.uid ?? rowIndex,
  });

  const rowRenderer = ({ index, isVisible, key, style, parent }) => {
    const rowArgs = {
      obj: data[index],
      columns,
      customData,
    };

    // do not render non visible elements (this excludes overscan)
    if (!isVisible) {
      return null;
    }

    const rowProps = getRowProps?.(rowArgs.obj);
    const rowId = rowProps?.id ?? key;
    return (
      <CellMeasurer
        cache={cellMeasurementCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <TableRow {...rowProps} id={rowId} index={index} trKey={key} style={style}>
          <RowMemo Row={Row} {...rowArgs} />
        </TableRow>
      </CellMeasurer>
    );
  };

  return (
    <VirtualTableBody
      autoHeight
      className="pf-v5-c-table pf-m-compact pf-m-border-rows pf-v5-c-window-scroller"
      deferredMeasurementCache={cellMeasurementCache}
      rowHeight={cellMeasurementCache.rowHeight}
      height={height || 0}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={10}
      columns={columns}
      rows={data}
      rowCount={data.length}
      rowRenderer={rowRenderer}
      scrollTop={scrollTop}
      width={width}
      onRowsRendered={onRowsRendered}
    />
  );
};
