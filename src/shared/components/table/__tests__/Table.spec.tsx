import * as React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { routerRenderer } from '../../../../utils/test-utils';
import { RowFunctionArgs, Table, TableData } from '../index';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const mockWindowScroller = jest.fn();

jest.mock('../../../utils', () => {
  const actual = jest.requireActual('../../../utils');
  return {
    ...actual,
    WithScrollContainer: () => {
      mockWindowScroller();
      return null;
    },
  };
});

const testData = [
  { id: '1', name: '1', value: 'Value 1' },
  { id: '2', name: '2', value: 'Value 2' },
  { id: '3', name: '3', value: 'Value 3' },
  { id: '4', name: '4', value: 'Value 4' },
  { id: '5', name: '5', value: 'Value 5' },
  { id: '6', name: '6', value: 'Value 6' },
  { id: '7', name: '7', value: 'Value 7' },
  { id: '8', name: '8', value: 'Value 8' },
  { id: '9', name: '9', value: 'Value 9' },
  { id: '10', name: '10', value: 'Value 10' },
  { id: '11', name: '11', value: 'Value 11' },
  { id: '12', name: '12', value: 'Value 12' },
  { id: '13', name: '13', value: 'Value 13' },
  { id: '14', name: '14', value: 'Value 14' },
  { id: '15', name: '15', value: 'Value 15' },
  { id: '16', name: '16', value: 'Value 16' },
  { id: '17', name: '17', value: 'Value 17' },
  { id: '18', name: '18', value: 'Value 18' },
  { id: '19', name: '19', value: 'Value 19' },
  { id: '20', name: '20', value: 'Value 20' },
];

const testHeader = () => {
  return [
    {
      title: 'Name',
      props: {},
    },
    {
      title: 'Value',
      props: {},
    },
  ];
};

const TestRow: React.FC<React.PropsWithChildren<RowFunctionArgs>> = ({ obj }) => {
  return (
    <>
      <TableData>{obj.name}</TableData>
      <TableData>{obj.value}</TableData>
    </>
  );
};

describe('Table', () => {
  let scrollerMock;
  beforeEach(() => {
    scrollerMock = jest.fn();
    mockWindowScroller.mockImplementation(() => scrollerMock);
  });

  it('should render all rows when not virtualized', () => {
    routerRenderer(
      <Table
        virtualize={false}
        data={testData}
        aria-label="Test List"
        Header={testHeader}
        Row={TestRow}
        getRowProps={(obj) => ({
          id: obj.id,
        })}
        loaded
      />,
    );
    screen.getByText('Value 1');
    screen.getByText('Value 2');
  });

  it('should render a window scroller when virtualized', () => {
    routerRenderer(
      <Table
        virtualize
        data={testData}
        aria-label="Test List"
        Header={testHeader}
        Row={TestRow}
        getRowProps={(obj) => ({
          id: obj.id,
        })}
        loaded
      />,
    );
    expect(mockWindowScroller).toHaveBeenCalled();
    expect(screen.queryByText('Value 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Value 2')).not.toBeInTheDocument();
  });
});
