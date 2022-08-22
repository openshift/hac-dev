import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Formik, FormikConfig } from 'formik';
import { DropdownItemObject } from '../../dropdown/BasicDropdown';
import DropdownField from '../DropdownField';
import '@testing-library/jest-dom';

type FormData = {
  dropdownValue: string;
};
const Wrapper: React.FC<FormikConfig<FormData>> = ({ children, ...formikConfig }) => (
  <Formik {...formikConfig}>
    {(formikProps) => (
      <form onSubmit={formikProps.handleSubmit}>
        {children}
        <input type="submit" value="Submit" />
      </form>
    )}
  </Formik>
);

const items: DropdownItemObject[] = [
  { key: 'key1', value: 'value1' },
  { key: 'key2', value: 'value2' },
  { key: 'key3', value: 'value3' },
];

const fieldName: string = 'dropdownValue';

const initialValues = {
  dropdownValue: items[0].value,
};

configure({ testIdAttribute: 'data-test' });

afterEach(jest.resetAllMocks);

describe('DropdownField', () => {
  it('renders dropdown field', () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <DropdownField name={fieldName} label="label" helpText="helpText" items={items} />
      </Wrapper>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('helpText')).toBeInTheDocument();
    expect(screen.getByText(initialValues.dropdownValue)).toBeInTheDocument();
  });

  it('renders dropdown menu with all menu items on toggle button click', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <DropdownField name={fieldName} label="label" helpText="helpText" items={items} />
      </Wrapper>,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(initialValues.dropdownValue));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      const menuItems = screen.getAllByRole('menuitem');
      const isItemExist = (item) =>
        menuItems.some((mi) => mi.firstChild.textContent === item.value);
      expect(items.every(isItemExist)).toBeTruthy();
    });
  });

  it('fires callback, renders dropdown field with newly selected value and closes menu on dropdown item click', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <DropdownField name={fieldName} label="label" helpText="helpText" items={items} />
      </Wrapper>,
    );
    expect(screen.getByTestId('dropdown-toggle').firstChild).toHaveTextContent(
      initialValues.dropdownValue,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(initialValues.dropdownValue));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeInTheDocument();
      const menuItem = screen.getByText(items[1].value);
      fireEvent.click(menuItem);
    });
    await waitFor(() => {
      expect(screen.getByTestId('dropdown-toggle').firstChild).toHaveTextContent(items[1].value);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('fires onChange callback if passed throught props', async () => {
    const onChange = jest.fn();
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <DropdownField
          name={fieldName}
          label="label"
          helpText="helpText"
          items={items}
          onChange={onChange}
        />
      </Wrapper>,
    );
    expect(screen.getByTestId('dropdown-toggle').firstChild).toHaveTextContent(
      initialValues.dropdownValue,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(initialValues.dropdownValue));
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeInTheDocument();
      const menuItem = screen.getByText(items[1].value);
      fireEvent.click(menuItem);
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders dropdown field with empty value for toggle button if no initial values passed', () => {
    render(
      <Wrapper initialValues={null} onSubmit={jest.fn()}>
        <DropdownField name={fieldName} label="label" helpText="helpText" items={items} />
      </Wrapper>,
    );
    expect(screen.getByText('label')).toBeInTheDocument();
    expect(screen.getByText('helpText')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-toggle').firstChild).toHaveTextContent('');
  });

  it('renders empty dropdown menu if items is empty', async () => {
    render(
      <Wrapper initialValues={initialValues} onSubmit={jest.fn()}>
        <DropdownField name={fieldName} label="label" helpText="helpText" items={[]} />
      </Wrapper>,
    );
    const dropdownDivContainer = screen.getByTestId('dropdown');
    expect(screen.getByTestId('dropdown-toggle').firstChild).toHaveTextContent(
      initialValues.dropdownValue,
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(dropdownDivContainer.children).toHaveLength(1);
    fireEvent.click(screen.getByText(initialValues.dropdownValue));
    await waitFor(() => {
      expect(dropdownDivContainer.children).toHaveLength(2);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
