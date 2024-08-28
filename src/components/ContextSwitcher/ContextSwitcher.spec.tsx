import * as React from 'react';
import { act, fireEvent, render, screen, configure } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ItemVisibility } from './context-switcher-utils';
import { ContextSwitcher, ContextTab, MenuTabs } from './ContextSwitcher';

configure({ testIdAttribute: 'data-test' });

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
    const items = [
      { name: 'Test 1', key: 'test1' },
      { name: 'Test 2', key: 'test2' },
    ];
    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: items,
          },
        ]}
        resourceType="application"
        footer={<>View workspace list</>}
      />,
    );
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('All')).toBeVisible();
    expect(screen.getByText('View workspace list')).toBeVisible();
  });

  it('should render recent Tab', () => {
    const items = [
      { name: 'Test 1', key: 'test1' },
      { name: 'Test 2', key: 'test2' },
    ];
    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: items,
          },
        ]}
        showRecentItems
        resourceType="application"
        footer={<>View workspace list</>}
      />,
    );
    act(() => screen.getByRole('button').click());

    expect(screen.getByPlaceholderText('Filter application by name')).toBeVisible();
    expect(screen.getByText('Recent')).toBeVisible();
    expect(screen.getByText('View workspace list')).toBeVisible();
  });

  it('should show currently selected item', () => {
    const item = [{ name: 'Test item', key: 'test' }];
    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: item,
          },
        ]}
        selectedItem={item[0]}
      />,
    );
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
    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: items,
          },
        ]}
        onSelect={callback}
        selectedItem={items[0]}
      />,
    );
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
    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: items,
          },
        ]}
        onSelect={callback}
        selectedItem={items[0]}
      />,
    );
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

  it('should show multiple Tabs', () => {
    const items = [
      { name: 'Test 1', key: 'test1', visibility: ItemVisibility.PRIVATE },
      { name: 'Test 2', key: 'test2', visibility: ItemVisibility.PRIVATE },
      { name: 'Test 3', key: 'test3', visibility: ItemVisibility.COMMUNITY },
    ];

    const publicItems = [{ name: 'Test 3', key: 'test3', visibility: ItemVisibility.COMMUNITY }];

    const privateItems = [
      { name: 'Test 1', key: 'test1', visibility: ItemVisibility.PRIVATE },
      { name: 'Test 2', key: 'test2', visibility: ItemVisibility.PRIVATE },
    ];

    render(
      <ContextSwitcher
        menuItems={[
          {
            tabKey: ContextTab.All,
            tabName: MenuTabs.All.name,
            displayName: MenuTabs.All.displayName,
            menuItems: items,
          },
          {
            tabKey: ContextTab.Public,
            tabName: MenuTabs.Public.name,
            displayName: MenuTabs.Public.displayName,
            menuItems: publicItems,
          },
          {
            tabKey: ContextTab.Private,
            tabName: MenuTabs.Private.name,
            displayName: MenuTabs.Private.displayName,
            menuItems: privateItems,
          },
        ]}
        selectedItem={items[0]}
      />,
    );
    act(() => screen.getByRole('button').click());

    expect(screen.getByText('All')).toBeVisible();
    expect(screen.getByText('Public')).toBeVisible();
    expect(screen.getByText('Private')).toBeVisible();
  });
});
