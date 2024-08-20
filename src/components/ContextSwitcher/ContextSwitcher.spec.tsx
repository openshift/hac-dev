import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemVisibility } from './context-switcher-utils';
import { ContextSwitcher } from './ContextSwitcher';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => (
      <a href={props.to} data-test={props['data-test']}>
        {props.children}
      </a>
    ),
  };
});

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(() => [{}, jest.fn()]),
}));

describe('ContextSwitcher', () => {
  it('should render context switcher component', () => {
    render(<ContextSwitcher menuItems={[]} resourceType="application" footer={<>footer text</>} />);
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('Public')).toBeVisible();
    expect(screen.getByText('Private')).toBeVisible();
    expect(screen.getByText('All')).toBeVisible();
    expect(screen.getByText('footer text')).toBeVisible();
  });

  it('should show currently selected item', () => {
    const item = { name: 'Test item', key: 'test' };
    render(<ContextSwitcher menuItems={[item]} selectedItem={item} />);
    act(() => screen.getByRole('button').click());

    const selectedItem = screen.getByRole('menuitem');
    expect(selectedItem).toBeVisible();
    expect(selectedItem).toHaveClass('pf-m-selected');
  });

  it('should close menu when item is selected', () => {
    const items = [
      { name: 'Test 1', key: 'test1' },
      { name: 'Test 2', key: 'test2' },
    ];
    const callback = jest.fn();
    render(<ContextSwitcher menuItems={items} onSelect={callback} />);
    act(() => screen.getByRole('button').click());

    act(() => screen.getByText('Test 1').click());
    expect(callback).toHaveBeenCalledWith({ name: 'Test 1', key: 'test1' });
    expect(screen.queryByText('Test 1')).toBeNull();
  });

  it('should allow filtering items', () => {
    const items = [
      { name: 'Test 1', key: 'test1' },
      { name: 'Test 2', key: 'test2' },
      { name: 'Test 3', key: 'test3' },
    ];
    const callback = jest.fn();
    render(<ContextSwitcher menuItems={items} onSelect={callback} />);
    act(() => screen.getByRole('button').click());

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Filter resource by name'), {
        target: { value: '2' },
      });
    });
    expect(screen.queryByText('Test 2')).toBeInTheDocument();
    expect(screen.queryByText('Test 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test 3')).not.toBeInTheDocument();
  });

  it('should show private items', () => {
    const items = [
      { name: 'Test 1', key: 'test1', visibility: ItemVisibility.PRIVATE },
      { name: 'Test 2', key: 'test2', visibility: ItemVisibility.PRIVATE },
      { name: 'Test 3', key: 'test3', visibility: ItemVisibility.COMMUNITY },
    ];

    render(<ContextSwitcher menuItems={items} />);
    act(() => screen.getByRole('button').click());

    act(() => screen.getByText('Private').click());

    expect(screen.queryByText('Test 1')).toBeInTheDocument();
    expect(screen.queryByText('Test 2')).toBeInTheDocument();
    expect(screen.queryByText('Test 3')).not.toBeInTheDocument();
  });
});
