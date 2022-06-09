import * as React from 'react';
import { match as RMatch } from 'react-router-dom';
import {
  Table as PfTable,
  TableHeader,
  TableGridBreakpoint,
  OnSelect,
  TableBody,
} from '@patternfly/react-table';
import { AutoSizer, WindowScroller } from '@patternfly/react-virtualized-extension';
import { useDeepCompareMemoize } from '../../hooks';
import { WithScrollContainer } from '../../utils';
import { StatusBox } from '../status-box/StatusBox';
import { RowFunctionArgs, VirtualBody, VirtualBodyProps } from './VirtualBody';
import './Table.scss';

export type Filter = { key: string; value: string };

export type TableWrapperProps = {
  virtualize: boolean;
  ariaLabel: string;
  ariaRowCount: number;
};

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
    <div className="table">
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
  );
};

export default Table;
