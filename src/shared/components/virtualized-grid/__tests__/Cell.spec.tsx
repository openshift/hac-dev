import * as React from 'react';
import { GridCellProps, CellMeasurerCache } from 'react-virtualized';
import { render, screen } from '@testing-library/react';
import Cell from '../Cell';
import { RenderHeader, RenderCell } from '../types';
import { CellMeasurementContext } from '../utils';

describe('Grid-cell', () => {
  let data: GridCellProps;
  let renderHeader: RenderHeader;
  let renderCell: RenderCell;
  let style: React.CSSProperties;
  beforeEach(() => {
    style = {
      height: 50,
      width: 50,
      top: 60,
      left: 60,
      position: 'absolute',
    };
    data = {
      key: 'unique-key',
      columnIndex: 0,
      rowIndex: 0,
      style,
      isScrolling: false,
      isVisible: false,
      parent: null,
    };
    renderHeader = jest.fn();
    renderCell = jest.fn(() => <div data-testid="cell">cell</div>);
  });

  const renderWithCellMeasurer = (cell: React.ReactNode) =>
    render(
      <CellMeasurementContext.Provider
        value={{
          cache: new CellMeasurerCache({
            defaultHeight: 50,
            minHeight: 200,
            fixedWidth: true,
          }),
        }}
      >
        {cell}
      </CellMeasurementContext.Provider>,
    );

  it('should return null when item is null', () => {
    const { container } = render(
      <Cell
        data={data}
        renderCell={renderCell}
        style={style}
        columnCount={1}
        rowCount={2}
        items={[null]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render cellMeasurer when item is not null', () => {
    renderWithCellMeasurer(
      <Cell
        data={data}
        renderCell={renderCell}
        style={style}
        columnCount={1}
        rowCount={2}
        items={[{}]}
      />,
    );
    expect(screen.getAllByTestId('cell')).toHaveLength(1);
  });

  it('should render header and not the cell when item is string and height should not be changed', () => {
    renderWithCellMeasurer(
      <Cell
        data={data}
        renderCell={renderCell}
        style={style}
        columnCount={1}
        rowCount={2}
        items={['string']}
        renderHeader={renderHeader}
      />,
    );
    expect(screen.getByRole('gridcell').style.height).toBe('50px');
    expect(screen.getByRole('gridcell').style.width).toBe('100%');
    expect(renderHeader).toHaveBeenCalledWith('string');
    expect(renderCell).not.toHaveBeenCalled();
  });

  it('should render Cell and not the Header when item is neither string nor null and height should be changed', () => {
    const item = { id: 1 };
    renderWithCellMeasurer(
      <Cell
        data={data}
        renderCell={renderCell}
        style={style}
        columnCount={1}
        rowCount={2}
        items={[item]}
      />,
    );
    expect(screen.getByRole('gridcell').style.height).toBe('50px');
    expect(screen.getByRole('gridcell').style.width).toBe('50px');
    expect(renderCell).toHaveBeenCalledWith(item);
    expect(renderHeader).not.toHaveBeenCalled();
  });
});
