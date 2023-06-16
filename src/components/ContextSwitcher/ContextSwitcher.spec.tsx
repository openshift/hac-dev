import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ContextSwitcher } from './ContextSwitcher';

jest.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(() => [{}, jest.fn()]),
}));

const localStorageMock = useLocalStorage as jest.Mock;

describe('ContextSwitcher', () => {
  it('should render context switcher component', () => {
    render(<ContextSwitcher menuItems={[]} resourceType="application" footer={<>footer text</>} />);
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('Recent')).toBeVisible();
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

  it('should use recent items from localStorage', () => {
    const items = [
      { name: 'Test 1', key: 'test1' },
      { name: 'Test 2', key: 'test2' },
      { name: 'Test 3', key: 'test3' },
    ];
    const setStorageMock = jest.fn();
    localStorageMock.mockReturnValue([
      { recentItems: { resource: ['test2', 'test3'] } },
      setStorageMock,
    ]);
    render(<ContextSwitcher menuItems={items} />);
    act(() => screen.getByRole('button').click());

    act(() => screen.getByText('Recent').click());
    expect(setStorageMock).toHaveBeenCalledWith(
      expect.objectContaining({ lastTab: { resource: 0 } }),
    );

    act(() => screen.getByText('Test 1').click());
    expect(setStorageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        recentItems: { resource: ['test1', 'test2', 'test3'] },
      }),
    );
  });
});
