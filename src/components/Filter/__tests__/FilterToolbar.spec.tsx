import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FilterToolbar } from '../FilterToolbar';

describe('FilterToolbar', () => {
  it('should render filter toolbar accurately', () => {
    render(
      <FilterToolbar
        value="test"
        dropdownItems={['Name']}
        onInput={jest.fn()}
        onFilterTypeChange={jest.fn()}
      />,
    );
    expect(screen.getByTestId('filter-toolbar')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Name' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name filter' })).toBeVisible();
  });

  it('should update filter type on select', () => {
    render(
      <FilterToolbar
        value="test"
        dropdownItems={['Name', 'Date']}
        onInput={jest.fn()}
        onFilterTypeChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Name')).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('option', { name: 'Date' }));
    });
    expect(screen.getByText('Date')).toBeVisible();
  });

  it('should capitalize filter type items', () => {
    render(
      <FilterToolbar
        value="test"
        dropdownItems={['name', 'date']}
        onInput={jest.fn()}
        onFilterTypeChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Name')).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    });
    expect(screen.getByRole('option', { name: 'Name' })).toBeVisible();
    expect(screen.getByRole('option', { name: 'Date' })).toBeVisible();
  });

  it('should run callback on enter', () => {
    const onInput = jest.fn();
    const onFilterChange = jest.fn();
    render(
      <FilterToolbar
        value="test"
        dropdownItems={['name', 'date']}
        onInput={onInput}
        onFilterTypeChange={onFilterChange}
      />,
    );
    expect(screen.getByText('Name')).toBeVisible();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Name' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('option', { name: 'Date' }));
    });
    expect(onFilterChange).toHaveBeenCalledWith('date');
    act(() => {
      fireEvent.input(screen.getByRole('textbox', { name: 'date filter' }), {
        target: { value: 'test' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    });
    expect(onInput).toHaveBeenCalledWith('');
  });
});
