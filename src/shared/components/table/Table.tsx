import * as React from 'react';
import { RouteMatch } from 'react-router-dom';
import { TableGridBreakpoint, OnSelect } from '@patternfly/react-table';
import { StatusBox } from '../status-box/StatusBox';
import TableComponent from './TableComponent';
import { RowFunctionArgs, VirtualBodyProps } from './VirtualBody';

import '../catalog/utils/skeleton-screen.scss';
import './Table.scss';

export type Filter = { key: string; value: string };

export type ComponentProps<D = any> = {
  data: D[];
  unfilteredData: D[];
  filters: Filter[];
  selected: boolean;
  match: RouteMatch<any>;
  kindObj: any;
};

export type HeaderFunc = (componentProps: ComponentProps) => any[];

export type TableProps<D = any, C = any> = Partial<ComponentProps<D>> & {
  customData?: C;
  Header: HeaderFunc;
  loadError?: string | Object;
  Row?: React.FC<RowFunctionArgs<D, C>>;
  'aria-label': string;
  onSelect?: OnSelect;
  NoDataEmptyMsg?: React.ComponentType<{}>;
  EmptyMsg?: React.ComponentType<{}>;
  Toolbar?: React.ReactNode;
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
  onRowsRendered?: VirtualBodyProps<D>['onRowsRendered'];
};

const Table: React.FC<TableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
  label,
  NoDataEmptyMsg,
  EmptyMsg,
  Toolbar,
  ...rest
}) => (
  <StatusBox
    skeleton={
      <div className="table-skeleton" data-testId="data-table-skeleton">
        {Toolbar ? <div className="skeleton-overview--head" /> : null}
        <div className="loading-skeleton--table" />
      </div>
    }
    data={data}
    loaded={loaded}
    loadError={loadError}
    unfilteredData={unfilteredData}
    label={label}
    NoDataEmptyMsg={NoDataEmptyMsg}
    EmptyMsg={EmptyMsg}
    Toolbar={Toolbar}
  >
    <TableComponent data={data} {...rest} />
  </StatusBox>
);

export default Table;
