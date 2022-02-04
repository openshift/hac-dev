import * as React from 'react';
import { match as RMatch } from 'react-router-dom';
import { CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import {
  Table as PfTable,
  TableHeader,
  TableGridBreakpoint,
  OnSelect,
  TableBody,
} from '@patternfly/react-table';
import {
  AutoSizer,
  VirtualTableBody,
  WindowScroller,
} from '@patternfly/react-virtualized-extension';
import { Scroll } from '@patternfly/react-virtualized-extension/dist/js/components/Virtualized/types';
import classNames from 'classnames';
import * as _ from 'lodash-es';
import { useDeepCompareMemoize } from '../../hooks';
import { WithScrollContainer } from '../../utils';
import { StatusBox } from '../status-box/StatusBox';

export type TableRowProps = {
  id: React.ReactText;
  index: number;
  title?: string;
  trKey: string;
  style: object;
  className?: string;
};

export type TableDataProps = {
  className?: string;
  columnID?: string;
  columns?: Set<string>;
  id?: string;
};

export type Filter = { key: string; value: string };

export type TableWrapperProps = {
  virtualize: boolean;
  ariaLabel: string;
  ariaRowCount: number;
};
const RowMemo = React.memo<RowFunctionArgs & { Row: React.FC<RowFunctionArgs> }>(
  ({ Row, ...props }) => <Row {...props} />,
);

export type TableProps<D = any, C = any> = Partial<ComponentProps<D>> & {
  customData?: C;
  Header: HeaderFunc;
  loadError?: string | Object;
  Row?: React.FC<RowFunctionArgs<D, C>>;
  'aria-label': string;
  onSelect?: OnSelect;
  NoDataEmptyMsg?: React.ComponentType<{}>;
  EmptyMsg?: React.ComponentType<{}>;
  loaded?: boolean;
  reduxID?: string;
  reduxIDs?: string[];
  label?: string;
  columnManagementID?: string;
  isPinned?: (val: D) => boolean;
  staticFilters?: Filter[];
  activeColumns?: Set<string>;
  gridBreakPoint?: TableGridBreakpoint;
  selectedResourcesForKind?: string[];
  expand?: boolean;
  getRowProps?: VirtualBodyProps<D>['getRowProps'];
  virtualize?: boolean;
};

export type ComponentProps<D = any> = {
  data: D[];
  filters: Filter[];
  selected: boolean;
  match: RMatch<any>;
  kindObj: any;
};

const TableWrapper: React.FC<TableWrapperProps> = ({
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

export const TableRow: React.FC<TableRowProps> = ({
  id,
  index,
  trKey,
  style,
  className,
  ...props
}) => {
  return (
    <tr
      {...props}
      data-id={id}
      data-index={index}
      data-test-rows="resource-row"
      data-key={trKey}
      style={style}
      className={className}
      role="row"
    />
  );
};

export const TableData: React.FC<TableDataProps> = ({ className, ...props }) => (
  <td {...props} className={className} role="gridcell" />
);

const VirtualBody: React.FC<VirtualBodyProps> = (props) => {
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
  } = props;

  const cellMeasurementCache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 44,
    keyMapper: (rowIndex) => _.get(props.data[rowIndex], 'metadata.uid', rowIndex),
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
      className="pf-c-table pf-m-compact pf-m-border-rows pf-c-window-scroller"
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
    />
  );
};

export type RowFunctionArgs<T = any, C = any> = {
  obj: T;
  columns: any[];
  customData?: C;
};

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
};

type HeaderFunc = (componentProps: ComponentProps) => any[];

const getActiveColumns = (Header: HeaderFunc, componentProps: ComponentProps) => {
  const columns = Header(componentProps);

  return columns;
};

const getComponentProps = (
  data: any[],
  filters: Filter[],
  selected: boolean,
  match: RMatch<any>,
  kindObj: any,
): ComponentProps => ({
  data,
  filters,
  selected,
  match,
  kindObj,
});

const Table: React.FC<TableProps> = ({
  filters: initFilters,
  selected,
  match,
  kindObj,
  Header: initHeader,
  Row,
  expand,
  label,
  'aria-label': ariaLabel,
  customData,
  gridBreakPoint = TableGridBreakpoint.none,
  loaded,
  loadError,
  NoDataEmptyMsg,
  EmptyMsg,
  data,
  getRowProps,
  virtualize = true,
}) => {
  const filters = useDeepCompareMemoize(initFilters);
  const Header = useDeepCompareMemoize(initHeader);
  //const [, setWindowWidth] = React.useState(window.innerWidth);
  const [columns] = React.useMemo(() => {
    const cProps = getComponentProps(data, filters, selected, match, kindObj);
    return [getActiveColumns(Header, cProps), cProps];
  }, [Header, data, filters, selected, match, kindObj]);

  const ariaRowCount = data && data.length;
  const renderVirtualizedTable = (scrollContainer) => (
    <WindowScroller scrollElement={scrollContainer}>
      {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <div ref={registerChild}>
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
              />
            </div>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
  const children = (
    <div className={classNames({ 'co-virtualized-table': virtualize })}>
      <TableWrapper virtualize={virtualize} ariaLabel={ariaLabel} ariaRowCount={ariaRowCount}>
        <PfTable
          cells={columns}
          gridBreakPoint={gridBreakPoint}
          role={virtualize ? 'presentation' : 'grid'}
          aria-label={virtualize ? null : ariaLabel}
          variant="compact"
          borders={false}
        >
          <TableHeader role="rowgroup" />
          {!virtualize && <TableBody />}
        </PfTable>
        {virtualize && <WithScrollContainer>{renderVirtualizedTable}</WithScrollContainer>}
      </TableWrapper>
    </div>
  );
  return (
    <div className="co-m-table-grid co-m-table-grid--bordered">
      <StatusBox
        skeleton={<div className="loading-skeleton--table" />}
        data={data}
        loaded={loaded}
        loadError={loadError}
        unfilteredData={data}
        label={label}
        NoDataEmptyMsg={NoDataEmptyMsg}
        EmptyMsg={EmptyMsg}
      >
        {children}
      </StatusBox>
    </div>
  );
};

export default Table;
