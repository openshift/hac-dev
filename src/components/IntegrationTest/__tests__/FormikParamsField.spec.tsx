import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen, render, act, fireEvent, waitFor } from '@testing-library/react';
import { useField, FieldArray } from 'formik';
import FormikParamsField from '../FormikParamsField';

jest.mock('formik', () => ({
  useField: jest.fn(),
  FieldArray: jest.fn(),
}));

const useFieldMock = useField as jest.Mock;
const FieldArrayMock = FieldArray as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('FormikParamsField', () => {
  beforeEach(() => {
    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction()}</div>;
    });
  });

  it('should render custom heading if provided', () => {
    useFieldMock.mockReturnValue([{}, { value: '' }]);
    render(<FormikParamsField fieldName="it.param" heading="My heading" />, {});
    expect(screen.getByText('My heading')).toBeInTheDocument();
  });

  it('should render default heading and add parameter button when no params', () => {
    useFieldMock.mockReturnValue([{}, { value: '' }]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);
    expect(screen.getByText('Parameters')).toBeInTheDocument();
    ('its-param-error-alert');
    expect(screen.getByTestId('add-param-button')).toBeInTheDocument();
  });

  it('should error when error occurs', () => {
    useFieldMock.mockReturnValue([{}, { value: '', touched: false, error: 'some error occurred' }]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);
    const errorr = screen.getByTestId('its-param-error-alert');
    expect(errorr).toBeInTheDocument();
    expect(errorr.classList.contains('pf-m-danger')).toBe(true);
    expect(screen.getByText('some error occurred')).toBeInTheDocument();
  });

  it('should three params', async () => {
    useFieldMock.mockReturnValue([
      {},
      {
        value: [
          { name: 'param1', value: 'value1' },
          { name: 'param2', value: 'value2' },
          { name: 'param3', value: 'value3' },
        ],
        touched: false,
      },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);
    screen.getByTestId('its-param-list');
    screen.getByTestId('its-param-1');
    screen.getByTestId('its-param-2');
    screen.getByTestId('its-param-3');

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
    });
  });

  it('should render param with multiple values', async () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
        touched: false,
      },
      { setValue, setTouched },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
      screen.queryByText('value2');
      screen.queryByText('value3');
    });
  });

  it('should remove param when remove param is clicked', async () => {
    const push = jest.fn();
    const remove = jest.fn();

    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push, remove })}</div>;
    });

    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
        touched: false,
      },
    ]);

    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
      screen.queryByText('value2');
      screen.queryByText('value3');
    });

    const removeParam = screen.getByTestId('remove-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(removeParam);
    });

    expect(remove).toHaveBeenCalled();
    expect(remove).toHaveBeenLastCalledWith(0);
  });

  it('should add value to param when add value is clicked', async () => {
    const push = jest.fn();
    const remove = jest.fn();

    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push, remove })}</div>;
    });

    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', value: 'value' }],
        touched: false,
      },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value');
    });

    const addValue = screen.getByTestId('add-value-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(addValue);
    });

    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenLastCalledWith('');
  });

  it('should render param with multiple values', async () => {
    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
        touched: false,
      },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
      screen.queryByText('value2');
      screen.queryByText('value3');
    });
  });

  it('should add param when add param is clicked', async () => {
    const push = jest.fn();
    const remove = jest.fn();

    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push, remove })}</div>;
    });

    useFieldMock.mockReturnValue([
      {},
      {
        value: [
          { name: 'param1', values: ['value1', 'value2', 'value3'] },
          { name: 'param2', values: ['value1'] },
        ],
        touched: false,
      },
    ]);

    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
      screen.queryByText('value2');
      screen.queryByText('value3');
    });

    const removeParam = screen.getByTestId('add-param-button').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(removeParam);
    });

    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenLastCalledWith({ name: 'param3', values: [''] });
  });

  it('should remove param when remove param is clicked', async () => {
    const push = jest.fn();
    const remove = jest.fn();

    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push, remove })}</div>;
    });

    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
        touched: false,
      },
    ]);

    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value1');
      screen.queryByText('value2');
      screen.queryByText('value3');
    });

    const removeParam = screen.getByTestId('remove-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(removeParam);
    });

    expect(remove).toHaveBeenCalled();
    expect(remove).toHaveBeenLastCalledWith(0);
  });

  it('should have enabled remove value button when multiple values and should remove values', async () => {
    const push = jest.fn();
    const remove = jest.fn();

    FieldArrayMock.mockImplementation((props) => {
      const renderFunction = props.render;
      return <div>{renderFunction({ push, remove })}</div>;
    });

    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value1', 'value2', 'value3'] }],
        touched: false,
      },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value');
    });

    const removeValue = screen.getByTestId('remove-value-1-3') as HTMLElement;
    expect(removeValue.getAttribute('aria-disabled')).toEqual('false');

    act(() => {
      fireEvent.click(removeValue);
    });

    expect(remove).toHaveBeenCalled();
    expect(remove).toHaveBeenLastCalledWith(2);
  });

  it('should have disabled remove value button when only single value', async () => {
    const setValue = jest.fn();
    const setTouched = jest.fn();
    useFieldMock.mockReturnValue([
      {},
      {
        value: [{ name: 'param1', values: ['value'] }],
        touched: false,
      },
      { setValue, setTouched },
    ]);
    render(<FormikParamsField fieldName="it.param" initExpanded={true} />);

    const expandParam = screen.getByTestId('expand-param-1').childNodes[0].childNodes[0];

    act(() => {
      fireEvent.click(expandParam);
    });

    await waitFor(() => {
      screen.queryByText('param1');
      screen.queryByText('value');
    });

    const removeValue = screen.getByTestId('remove-value-1-1') as HTMLElement;
    expect(removeValue.getAttribute('aria-disabled')).toEqual('true');
  });
});
