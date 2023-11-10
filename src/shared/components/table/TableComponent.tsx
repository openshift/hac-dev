import * as React from 'react';
import { RouteMatch } from 'react-router-dom';
import { TableGridBreakpoint } from '@patternfly/react-table';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { AutoSizer, WindowScroller } from '@patternfly/react-virtualized-extension';
import { useDeepCompareMemoize } from '../../hooks';
import { WithScrollContainer } from '../../utils';
import { ComponentProps, Filter, HeaderFunc, TableProps } from './Table';
import { TableRow } from './TableRow';
import { VirtualBody } from './VirtualBody';

import './Table.scss';

export type TableWrapperProps = {
  virtualize: boolean;
  ariaLabel: string;
  ariaRowCount: number;
};

const TableWrapper: React.FC<React.PropsWithChildren<TableWrapperProps>> = ({
  virtualize,
  ariaLabel,
  ariaRowCount,
  ...props
}) => {
  return virtualize ? (
    <div {...props} role="grid" aria-label={ariaLabel} aria-rowcount={ariaRowCount} />
  ) : (
    <React.Fragment {...props} />
  );
};

const getActiveColumns = (Header: HeaderFunc, componentProps: ComponentProps) =>
  Header(componentProps);

const getComponentProps = (
  data: any[],
  unfilteredData: any[],
  filters: Filter[],
  selected: boolean,
  match: RouteMatch<any>,
  kindObj: any,
): ComponentProps => ({
  data,
  unfilteredData,
  filters,
  selected,
  match,
  kindObj,
});

const TableComponent: React.FC<React.PropsWithChildren<TableProps>> = ({
  filters: initFilters,
  selected,
  match,
  kindObj,
  Header: initHeader,
  Row,
  expand,
  'aria-label': ariaLabel,
  customData,
  gridBreakPoint = TableGridBreakpoint.none,
  data,
  unfilteredData,
  getRowProps,
  virtualize = true,
  onRowsRendered,
}) => {
  const filters = useDeepCompareMemoize(initFilters);
  const Header = useDeepCompareMemoize(initHeader);
  //const [, setWindowWidth] = React.useState(window.innerWidth);
  const [columns] = React.useMemo(() => {
    const cProps = getComponentProps(data, unfilteredData, filters, selected, match, kindObj);
    return [getActiveColumns(Header, cProps), cProps];
  }, [data, unfilteredData, filters, selected, match, kindObj, Header]);

  const ariaRowCount = data && data.length;
  const renderVirtualizedTable = (scrollContainer) => (
    <WindowScroller scrollElement={scrollContainer}>
      {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <div ref={registerChild as any}>
              <VirtualBody
                Row={Row}
                customData={customData}
                height={height}
                isScrolling={isScrolling}
                onChildScroll={onChildScroll}
                data={data}
                columns={columns}
                scrollTop={scrollTop}
                width={width}
                expand={expand}
                getRowProps={getRowProps}
                onRowsRendered={onRowsRendered}
              />
            </div>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );

  const rowRenderer = (obj, index) => {
    const rowProps = getRowProps?.(obj);

    return (
      <TableRow
        id={getRowProps(obj).id}
        index={index}
        key={`${getRowProps(obj).id}`}
        trKey={`${getRowProps(obj).id}`}
        style={{}}
        {...rowProps}
      >
        <Row obj={obj} columns={columns} customData={customData} />
      </TableRow>
    );
  };

  return (
    <div className="table">
      <TableWrapper virtualize={virtualize} ariaLabel={ariaLabel} ariaRowCount={ariaRowCount}>
        <PfTable
          className="table__header"
          cells={columns}
          gridBreakPoint={gridBreakPoint}
          role={virtualize ? 'presentation' : 'grid'}
          aria-label={virtualize ? null : ariaLabel}
          variant="compact"
          borders={false}
        >
          <TableHeader role="rowgroup" />
          {!virtualize ? <tbody>{data.map((obj, index) => rowRenderer(obj, index))}</tbody> : null}
        </PfTable>
        {virtualize && <WithScrollContainer>{renderVirtualizedTable}</WithScrollContainer>}
      </TableWrapper>
    </div>
  );
};

export default TableComponent;
