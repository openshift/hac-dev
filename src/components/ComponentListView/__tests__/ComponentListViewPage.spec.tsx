import * as React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '../../../dynamic-plugin-sdk';
import { ComponentListViewPage } from '../ComponentListViewPage';

jest.mock('../../../dynamic-plugin-sdk', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useActiveNamespace', () => ({
  useActiveNamespace: jest.fn(() => 'test-ns'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ComponentListViewPage', () => {
  it('renders component list view page', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<ComponentListViewPage application="test" />);
  });

  it('renders button to add components', () => {
    watchResourceMock.mockReturnValue([
      [
        {
          metadata: { uid: 'test' },
          spec: { application: 'test', source: { git: 'example.com' } },
        },
      ],
      true,
    ]);

    render(<ComponentListViewPage application="test-app" />);
    const button = screen.getByText('Add Component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toBe('http://localhost/?application=test-app');
  });

  it('renders filter toolbar', () => {
    watchResourceMock.mockReturnValue([
      [
        {
          metadata: { uid: 'test' },
          spec: { application: 'test', source: { git: 'example.com' } },
        },
      ],
      true,
    ]);
    render(<ComponentListViewPage application="test-app" />);
    expect(screen.getByTestId('component-list-filter-toolbar')).toBeInTheDocument();
  });
  it('renders 3 component entries', () => {
    watchResourceMock.mockReturnValue([
      [
        {
          metadata: { name: 'test-aaa', uid: 'test' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
        {
          metadata: { name: 'aab-test', uid: 'test2' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
        {
          metadata: { name: 'test-abc-test', uid: 'test3' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
      ],
      true,
    ]);
    render(<ComponentListViewPage application="test-app" />);
    const searchInput = screen.getByTestId('nameInput1');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(3);
  });

  it('renders 2 component entries', () => {
    watchResourceMock.mockReturnValue([
      [
        {
          metadata: { name: 'test-aaa', uid: 'test' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
        {
          metadata: { name: 'aab-test', uid: 'test2' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
        {
          metadata: { name: 'test-abc-test', uid: 'test3' },
          spec: { application: 'test-app', source: { git: 'example.com' } },
        },
      ],
      true,
    ]);
    render(<ComponentListViewPage application="test-app" />);
    const searchInput = screen.getByTestId('nameInput1');
    fireEvent.change(searchInput, { target: { value: 'aa' } });
    const componentList = screen.getByTestId('component-list');
    const componentListItems = within(componentList).getAllByTestId('component-list-item');
    expect(componentListItems.length).toBe(2);
  });
});
